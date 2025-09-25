'use strict';

const customerRepository = require('../repositories/customer.repository');
const productionOrderRepository = require('../repositories/productionOrders.repository');
const productionOrderDirectlyRepository = require('../repositories/productionOrderDirect.repository');
const productionOrderPetRepository = require('../repositories/productionOrderPet.repository');
const receiptOutsideRepository = require('../repositories/receiptOutside.repository');
const revenueExpenditureHistoryRepository = require('../repositories/revenueExpenditureHistory.repository');

// ----- helpers -----
const YESNO = { NO: 0, YES: 1, MAYBE: 2 };
const PAY = { UNPAID: 0, PAID: 1, PARTPAY: 2 };

// time helpers
function startOfDay(ms) {
  if (!ms) return null;
  const d = new Date(Number(ms));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function endOfDay(ms) {
  if (!ms) return null;
  const d = new Date(Number(ms));
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

// convert Yes/No string/number/bool → 0|1|2|null
function ynToNum(v) {
  if (v == null || v === 'null') return null;
  if (typeof v === 'number') return v;
  const s = String(v).toUpperCase();
  if (s === 'NO' || s === '0' || s === 'FALSE') return 0;
  if (s === 'YES' || s === '1' || s === 'TRUE') return 1;
  if (s === 'MAYBE' || s === '2') return 2;
  return null;
}

// trim chuỗi rỗng -> null
function trimOrNull(v) {
  if (typeof v !== 'string') return v ?? null;
  const t = v.trim();
  return t.length ? t : null;
}

// ----- main -----
exports.getList = async (body = {}, headers = {}) => {
  // === 1) Chuẩn hoá input ===
  const p = {
    pageNumber: Number(body.pageNumber || 1),
    pageSize: Number(body.pageSize || 20),

    name: trimOrNull(body.name),
    salerName: trimOrNull(body.salerName),
    code: trimOrNull(body.code),
    phone: trimOrNull(body.phone),
    address: trimOrNull(body.address),
    company: trimOrNull(body.company),
    colorTester: trimOrNull(body.colorTester),

    isRevenue: body.isRevenue != null ? Number(body.isRevenue) : null,

    isPet: ynToNum(body.isPet),
    isThernal: ynToNum(body.isThernal),
    isDirect: ynToNum(body.isDirect),

    salerId: body.salerId != null ? Number(body.salerId) : null,
    colorTesterId: body.colorTesterId != null ? Number(body.colorTesterId) : null,
    directColorTesterId: body.directColorTesterId != null ? Number(body.directColorTesterId) : null,

    type: body.type != null ? Number(body.type) : null,
    source: body.source != null ? Number(body.source) : null,
    commodity: body.commodity != null ? Number(body.commodity) : null,

    haveDebt: body.haveDebt != null ? ynToNum(body.haveDebt) : null,

    fromTime: body.fromTime != null ? startOfDay(body.fromTime) : null,
    toTime: body.toTime != null ? endOfDay(body.toTime) : null,
  };

  // Nếu dùng headers role giống các service khác:
  const role = headers['x-user-role'] || headers['X-User-Role'];
  const uid = headers['x-user-id'] || headers['X-User-Id'];
  // isSale()
  if (!p.salerId && role && String(role).toUpperCase() === 'ROLE_SALE' && uid) {
    p.salerId = Number(uid);
  }
  // isColorTest()
  if (!p.colorTesterId && role && String(role).toUpperCase() === 'ROLE_COLOR_TEST' && uid) {
    p.colorTesterId = Number(uid);
  }
  // isColorTestDirectly()
  if (!p.directColorTesterId && role && String(role).toUpperCase() === 'ROLE_COLOR_TEST_DIRECT' && uid) {
    p.directColorTesterId = Number(uid);
  }

  // === 2) Tính danh sách customer ids theo haveDebt (nếu được yêu cầu) ===
  let ids = [];
  if (p.haveDebt != null) {
    // Lấy các đơn Thermal COMPLETE (hoặc logic bạn đang dùng)
    const lstStatusOrder = ['COMPLETE']; // như Java
    // Directly: DELIVERED
    const lstStatusOrderDirectly = ['DELIVERED'];
    // PET: COMPLETE
    const lstStatusOrderPet = ['COMPLETE'];
    // payment: UNPAID, PARTPAY
    const lstPaymentStatus = [PAY.UNPAID, PAY.PARTPAY];

    // các khoảng thời gian áp dụng
    const fromDate = p.fromTime;
    const toDate = p.toTime;

    // --- 2.1 thermal orders ---
    const listOrder = await productionOrderRepository.findAndCount({
      // đủ các filter cần để giới hạn theo colorTesterId nếu có (Java dùng colorTesterId ở tham số giữa)
      lstStatus: lstStatusOrder,
      lstPaymentStatus,
      deleteStatus: YESNO.NO,
      fromCompletedTime: fromDate,
      toCompletedTime: toDate,
      colorTesterId: p.colorTesterId || null,
      // những tham số không dùng có thể bỏ trống
      pageSize: 999999, pageNumber: 1,
    }).then(r => r.rows || []);

    // --- 2.2 directly orders ---
    const listOrderDirect = await productionOrderDirectlyRepository.findAndCount({
      lstStatus: lstStatusOrderDirectly,
      lstPaymentStatus,
      deleteStatus: YESNO.NO,
      fromCompletedTime: fromDate,
      toCompletedTime: toDate,
      colorTesterId: p.directColorTesterId || null, // repo direct đang dùng colorTesterId (nếu có) – nếu bạn dùng key khác thì chỉnh
      pageSize: 999999, pageNumber: 1,
    }).then(r => r.rows || []);

    // --- 2.3 pet orders ---
    const listOrderPet = await productionOrderPetRepository.findAndCount({
      lstStatus: lstStatusOrderPet,
      lstPaymentStatus,
      isDelete: YESNO.NO,
      fromDeliveryTime: fromDate,
      toDeliveryTime: toDate,
      pageSize: 999999, pageNumber: 1,
    }).then(r => r.rows || []);

    // --- 2.4 receipt outside ---
    const listReceiptOutside = await receiptOutsideRepository.getList({
      // triển khai getList giống Java: filter by fromTime/toTime & payment UNPAID/PARTPAY
      fromTime: fromDate,
      toTime: toDate,
      lstPaymentStatus,
      pageSize: 999999, pageNumber: 1,
    });

    // Build set ids KH có nợ (có phát sinh doanh thu/phiếu thu ngoài)
    const setIds = new Set();

    // Thermal: price > 0 và extracted_quantity > 0 (ở DTO JS bạn có extractedQuantity?)
    // Nếu repo findAndCount đã map `extractedQuantity`, dùng nó; nếu không, thay bằng field thật.
    for (const od of listOrder) {
      const price = Number(od?.price || 0);
      const extracted = Number(od?.extractedQuantity || 0); // TUỲ MAP CỦA BẠN
      if (price > 0 && extracted > 0 && od?.customer?.id) {
        setIds.add(Number(od.customer.id));
      }
    }

    // Directly: price > 0 và printedQuantity > 0
    for (const od of listOrderDirect) {
      const price = Number(od?.price || 0);
      const printed = Number(od?.printedQuantity || 0);
      if (price > 0 && printed > 0 && od?.customer?.id) {
        setIds.add(Number(od.customer.id));
      }
    }

    // PET: price > 0 và deliveryQuantity > 0
    for (const od of listOrderPet) {
      const price = Number(od?.price || 0);
      const delivery = Number(od?.deliveryQuantity || 0);
      if (price > 0 && delivery > 0 && od?.customer?.id) {
        setIds.add(Number(od.customer.id));
      }
    }

    // Receipt outside: value > 0
    for (const rc of (listReceiptOutside || [])) {
      const val = Number(rc?.value || 0);
      if (val > 0 && rc?.customer?.id) {
        setIds.add(Number(rc.customer.id));
      }
    }

    if (p.haveDebt === YESNO.NO) {
      // Lấy all customers rồi loại bỏ những ai nằm trong setIds
      const all = await customerRepository.getListV3(
        p.type, p.source, p.commodity,
        null, // ids null để lấy tất cả
        p.colorTesterId, p.directColorTesterId, p.salerId,
        p.name, p.salerName, p.code, p.phone, p.address, p.company,
        p.isPet, p.isThernal, p.isDirect,
        null, // pageable null => repo tự bỏ limit; hoặc bạn viết hàm riêng getAll
        p.colorTester
      );
      const noDebtIds = [];
      for (const c of all || []) {
        if (c?.id != null && !setIds.has(Number(c.id))) noDebtIds.push(Number(c.id));
      }
      ids = noDebtIds;
    } else {
      // YES -> chỉ những ai trong setIds
      ids = Array.from(setIds);
    }
  }

  // === 3) Query danh sách customer theo filters (V3) ===
  const pageable = { pageNumber: p.pageNumber, pageSize: p.pageSize };
  const customers = await customerRepository.getListV3(
    p.type, p.source, p.commodity,
    ids && ids.length ? ids : null,
    p.colorTesterId, p.directColorTesterId, p.salerId,
    p.name, p.salerName, p.code, p.phone, p.address, p.company,
    p.isPet, p.isThernal, p.isDirect,
    pageable,
    p.colorTester
  );

  const count = await customerRepository.countListV3(
    p.type, p.source, p.commodity,
    ids && ids.length ? ids : null,
    p.colorTesterId, p.directColorTesterId, p.salerId,
    p.name, p.salerName, p.code, p.phone, p.address, p.company,
    p.isPet, p.isThernal, p.isDirect,
    p.colorTester
  );

  // === 4) isRevenue == 1 → tính RevenueObject cho từng KH (giống Java) ===
  // LƯU Ý: đoạn này tốn query. Nếu cần tối ưu, gom SUM theo batch.
  let list = customers || [];
  if (p.isRevenue === 1) {
    const fromDate = p.fromTime;
    const toDate = p.toTime;

    list = await Promise.all(
      list.map(async (c) => {
        const customer = { ...(c.toJSON ? c.toJSON() : c) };

        const result = {
          total: 0,
          revenue: 0, // tổng chi/giảm trừ (thanh toán)
          totalDebtBeforeTime: 0,
          remain: 0,
        };

        // THERNAL
        if (customer.isThernal === YESNO.YES) {
          const lstStatus = ['COMPLETE'];

          let total = await productionOrderRepository.sumPrice({
            lstStatus,
            deleteStatus: YESNO.NO,
            customerId: customer.id,
            fromCompletedTime: fromDate,
            toCompletedTime: toDate,
          });
          total = Number(total || 0);

          // + receipt outside (khoản thu ngoài)
          let outside = await receiptOutsideRepository.sumValue({
            customerId: customer.id,
            fromTime: fromDate,
            toTime: toDate,
          });
          total += Number(outside || 0);

          // payments trong khoảng
          let payment = await revenueExpenditureHistoryRepository.sumPaymentCost({
            isCustomer: YESNO.NO, // theo Java tham số, điều chỉnh repo của bạn
            fromTime: fromDate,
            toTime: toDate,
            customerId: customer.id,
          });
          let reduce = await revenueExpenditureHistoryRepository.sumReduceCost({
            isCustomer: YESNO.NO,
            fromTime: fromDate,
            toTime: toDate,
            customerId: customer.id,
          });
          let revenue = Number(payment || 0) + Number(reduce || 0);

          // tổng trước fromDate
          let sumBefore = 0;
          let payBefore = 0;
          if (fromDate != null) {
            sumBefore = Number(await productionOrderRepository.sumPrice({
              lstStatus,
              customerId: customer.id,
              toCompletedTime: fromDate,
            }) || 0);
            sumBefore += Number(await receiptOutsideRepository.sumValue({
              customerId: customer.id,
              toTime: fromDate,
            }) || 0);

            const reduceB = Number(await revenueExpenditureHistoryRepository.sumReduceCost({
              toTime: fromDate,
              customerId: customer.id,
            }) || 0);
            const payB = Number(await revenueExpenditureHistoryRepository.sumPaymentCost({
              toTime: fromDate,
              customerId: customer.id,
            }) || 0);
            payBefore = reduceB + payB;
          }

          const remain = total + (sumBefore - payBefore) - revenue;
          const totalDebtBeforeTime = sumBefore - payBefore;

          customer.revenue = {
            total,
            revenue,
            totalDebtBeforeTime,
            remain,
          };
          customer.isDebt = remain > 0 ? YESNO.YES : YESNO.NO;
        }

        // DIRECT
        if (customer.isDirect === YESNO.YES) {
          const lstStatusDirectly = ['DELIVERED'];

          let total = Number(await productionOrderDirectlyRepository.sumPrice({
            lstStatus: lstStatusDirectly,
            deleteStatus: YESNO.NO,
            customerId: customer.id,
            fromCompletedTime: fromDate,
            toCompletedTime: toDate,
          }) || 0);
          total += Number(await receiptOutsideRepository.sumValue({
            customerId: customer.id,
            fromTime: fromDate,
            toTime: toDate,
          }) || 0);

          let payment = Number(await revenueExpenditureHistoryRepository.sumPaymentCost({
            fromTime: fromDate,
            toTime: toDate,
            customerId: customer.id,
          }) || 0);
          let reduce = Number(await revenueExpenditureHistoryRepository.sumReduceCost({
            fromTime: fromDate,
            toTime: toDate,
            customerId: customer.id,
          }) || 0);
          let revenue = payment + reduce;

          let sumBefore = 0, payBefore = 0;
          if (fromDate != null) {
            sumBefore = Number(await productionOrderDirectlyRepository.sumPrice({
              lstStatus: lstStatusDirectly,
              customerId: customer.id,
              toCompletedTime: fromDate,
            }) || 0);
            sumBefore += Number(await receiptOutsideRepository.sumValue({
              customerId: customer.id,
              toTime: fromDate,
            }) || 0);

            const reduceB = Number(await revenueExpenditureHistoryRepository.sumReduceCost({
              toTime: fromDate,
              customerId: customer.id,
            }) || 0);
            const payB = Number(await revenueExpenditureHistoryRepository.sumPaymentCost({
              toTime: fromDate,
              customerId: customer.id,
            }) || 0);
            payBefore = reduceB + payB;
          }

          const remain = total + (sumBefore - payBefore) - revenue;
          const totalDebtBeforeTime = sumBefore - payBefore;

          customer.revenue = {
            total,
            revenue,
            totalDebtBeforeTime,
            remain,
          };
          customer.isDebt = remain > 0 ? YESNO.YES : YESNO.NO;
        }

        // PET
        if (customer.isPet === YESNO.YES) {
          const lstStatus = ['COMPLETE'];

          let total = Number(await productionOrderPetRepository.sumPrice({
            lstStatus,
            isDelete: YESNO.NO,
            customerId: customer.id,
            fromDeliveryTime: fromDate,
            toDeliveryTime: toDate,
          }) || 0);
          total += Number(await receiptOutsideRepository.sumValue({
            customerId: customer.id,
            fromTime: fromDate,
            toTime: toDate,
          }) || 0);

          let payment = Number(await revenueExpenditureHistoryRepository.sumPaymentCost({
            // lưu ý Java dùng YES với tham số nào đó — chỉnh cho đúng repo của bạn
            fromTime: fromDate,
            toTime: toDate,
            customerId: customer.id,
          }) || 0);
          let reduce = Number(await revenueExpenditureHistoryRepository.sumReduceCost({
            fromTime: fromDate,
            toTime: toDate,
            customerId: customer.id,
          }) || 0);
          let revenue = payment + reduce;

          let sumBefore = 0, payBefore = 0;
          if (fromDate != null) {
            sumBefore = Number(await productionOrderPetRepository.sumPrice({
              lstStatus,
              customerId: customer.id,
              toDeliveryTime: fromDate,
            }) || 0);
            sumBefore += Number(await receiptOutsideRepository.sumValue({
              customerId: customer.id,
              toTime: fromDate,
            }) || 0);

            const reduceB = Number(await revenueExpenditureHistoryRepository.sumReduceCost({
              toTime: fromDate,
              customerId: customer.id,
            }) || 0);
            const payB = Number(await revenueExpenditureHistoryRepository.sumPaymentCost({
              toTime: fromDate,
              customerId: customer.id,
            }) || 0);
            payBefore = reduceB + payB;
          }

          const remain = total + (sumBefore - payBefore) - revenue;
          const totalDebtBeforeTime = sumBefore - payBefore;

          customer.revenue = {
            total,
            revenue,
            totalDebtBeforeTime,
            remain,
          };
          customer.isDebt = remain > 0 ? YESNO.YES : YESNO.NO;
        }

        return customer;
      })
    );
  }

  return { list, count: Number(count || 0) };
};

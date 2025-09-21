import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { dateFormat } from '../../../utils/constants';
import { compareDiffByKeys } from '../../../utils/common';
const courseFieldsToCompare = [
  'code',
  'name',
  'trainingCategory',
  'csdtCode',
  'courseStartDate',
  'courseEndDate',
  'createdDate',
  'isActive',
];
const studentFieldsToCompare = [
  'code',
  'name',
  'middleName',
  'fullName',
  'trainingCategory',
  'drivingLicenseCategory',
  'csdtCode',
  'birthday',
  'permanentResidence',
  'nationalId',
  'nationalIdIssueDate',
  'nationality',
  'gender',
  'courseCode',
  'residence',
  'isActive',
];

function generateTreeData(data) {
  if (!data) return false;
  const tree = [];
  Object.entries(data).forEach(([year, months]) => {
    const yearNode = { key: `y-${year}`, title: `Năm ${year}`, children: [] };
    tree.push(yearNode);
    const mothsDesc = Object.fromEntries(Object.entries(months).reverse());
    Object.entries(mothsDesc).forEach(([month, courses]) => {
      const monthNode = {
        key: `y-${year}-m-${month}`,
        title: `Tháng ${month}`,
        children: [],
      };
      const coursesDescByCreatedDate = courses.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );
      coursesDescByCreatedDate.forEach((course) => {
        const isDifferent = compareDiffByKeys(
          course,
          course.datCourse,
          courseFieldsToCompare,
        );
        const courseNode = {
          key: `course-${course.code}`,
          title: `Khóa ${course.code}`,
          code: course.code,
          csdtCode: course.csdtCode,
          isDifferent,
          fpt: {
            code: course.code,
            trainingCategory: course.trainingCategory,
            drivingLicenseCategory: course.drivingLicenseCategory,
            name: course.name,
            csdtCode: course.csdtCode,
            courseStartDate: course.courseStartDate,
            courseEndDate: course.courseEndDate,
            isActive: course.isActive,
            createdDate: course.createdDate,
            internalTraining: course.internalTraining || false,
          },
          dat: course.datCourse,
          /* {
            code: course.datCourse?.code,
            trainingCategory: course.datCourse?.trainingCategory,
          }, */
          children: [],
        };
        monthNode.children.push(courseNode);
      });

      yearNode.children.push(monthNode);
    });
  });

  return tree.reverse();
}

const SyncCourse = ({
  dispatch,
  loading,
  getStudentsLoading,
  syncDataLoading,
}) => {
  const [treeData, setTreeData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const loadChildren = async (record, isUpdated) => {
    if (
      record.key.startsWith('course-') &&
      (isUpdated || isEmpty(record.children))
    ) {
      const courseCode = record.code;

      const res = await dispatch({
        type: 'SyncData/getStudentsByCourseCode',
        courseCode,
        payload: { csdtCode: record.csdtCode },
      });
      if (!res) return;
      // TODO: Replace with actual call to your main DB (DAT)

      // Mapping dựa theo code
      const children = res.map((item, index) => {
        const isDifferent = compareDiffByKeys(
          item,
          item.dat,
          studentFieldsToCompare,
        );
        return {
          key: `student-${index}-${record.key}`,
          title: `${index + 1}. ${item.fullName}`,
          code: item.code,
          isSync: item.isSync,
          isDifferent,
          fpt: {
            code: item.code,
            name: item.name,
            middleName: item.middleName,
            fullName: item.fullName,
            csdtCode: item.csdtCode,
            birthday: item.birthday,
            permanentResidence: item.permanentResidence,
            residence: item.residence,
            nationalId: item.nationalId,
            nationalIdIssueDate: item.nationalIdIssueDate,
            nationality: item.nationality,
            gender: item.gender,
            courseCode: item.courseCode,
            drivingLicenseCategory: item.drivingLicenseCategory,
            trainingCategory: item.trainingCategory,
            isActive: item.isActive,
          },
          dat: item.dat || {},
        };
      });

      record.children = children;
      setTreeData([...treeData]);
    }
  };

  const handleFetch = useCallback(async () => {
    const res = await dispatch({
      type: 'SyncData/queryTableCourses',
      payload: {},
    });
    setTreeData(generateTreeData(res.data));
  }, []);

  const buildPayload = (selectedKeys, treeData) => {
    console.log(selectedKeys);
    const courseMap = new Map();

    const walk = (nodes, parentCourse = null) => {
      for (const node of nodes) {
        if (node.key.startsWith('course-')) {
          const courseKey = node.key;
          const isCourseSelected = selectedKeys.includes(courseKey);
          const courseData = {
            course: node.fpt, // hoặc gom cả fpt & dat nếu cần
            isSync: !node.isDifferent,
            students: [],
          };

          if (isCourseSelected) {
            // Nếu chọn khóa học → thêm tất cả học viên
            courseData.sync = true;
            (node.children || []).forEach((student) => {
              courseData.students.push(student.fpt); // hoặc { fpt, dat }
            });
            courseMap.set(courseKey, courseData);
          }
          walk(node.children || [], node);
        } else if (node.key.startsWith('student-')) {
          const isStudentSelected = selectedKeys.includes(node.key);
          if (!isStudentSelected) continue;

          const courseKey = parentCourse?.key;
          if (!courseKey) continue;

          if (!courseMap.has(courseKey)) {
            courseMap.set(courseKey, {
              course: parentCourse.fpt,
              isSync: !parentCourse.isDifferent,
              students: [],
            });
          }

          const courseEntry = courseMap.get(courseKey);
          if (!courseEntry.students.find((s) => s.code === node.fpt.code)) {
            courseEntry.students.push(node.fpt);
          }

          // Nếu course chưa sync → cần đẩy cả course
          if (!courseEntry.isSync) {
            courseEntry.includeCourse = true;
          }
        } else if (node.children) {
          walk(node.children, parentCourse);
        }
      }
    };

    walk(treeData);

    // Convert về array & lọc kết quả
    return Array.from(courseMap.values()).map((entry) => ({
      course: entry.includeCourse !== false ? entry.course : undefined,
      students: entry.students,
      isSync: !!entry.isSync,
      sync: !!entry.sync,
    }));
  };

  const refreshStudents = async (selectedKeys, treeData) => {
    console.log(selectedKeys);

    const walk = (nodes, parentCourse = null) => {
      for (const node of nodes) {
        if (node.key.startsWith('course-')) {
          const courseKey = node.key;
          /*  const isCourseSelected = selectedKeys.some((key) =>
            key.includes(courseKey),
          ); */
          const isCourseSelected = selectedKeys.includes(courseKey);

          if (isCourseSelected) {
            // Nếu chọn khóa học → thêm tất cả học viên
            loadChildren(node, true);
          }
          walk(node.children || [], node);
        } else if (node.children) {
          walk(node.children, parentCourse);
        }
      }
    };

    walk(treeData);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const columns = [
    {
      title: (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>Danh mục</div>
      ),
      dataIndex: 'title',
      width: 300,
    },
    {
      title: (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Hệ thống FPT
        </div>
      ),
      children: [
        {
          dataIndex: ['fpt', 'name'],
          align: 'center',
          render: (_, record) => {
            if (record.key.startsWith('course-')) {
              const isDiff = record.fpt.code !== record.dat?.code;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.fpt.code}
                </span>
              );
            } else if (record.key.startsWith('student-')) {
              const isDiff = record.fpt.fullName !== record.dat?.fullName;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.fpt.fullName}
                </span>
              );
            }
            return '';
          },
        },
        {
          dataIndex: ['fpt', 'id'],
          align: 'center',
          render: (_, record) => {
            if (record.key.startsWith('course-')) {
              const isDiff =
                record.fpt.trainingCategory !== record.dat?.trainingCategory;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.fpt.trainingCategory}
                </span>
              );
            } else if (record.key.startsWith('student-')) {
              const isDiff = record.fpt.birthday !== record.dat?.birthday;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.fpt.birthday
                    ? moment(record.fpt.birthday).format(dateFormat)
                    : '-'}
                </span>
              );
            }
            return '';
          },
        },
      ],
    },
    {
      title: (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Hệ thống DAT
        </div>
      ),
      children: [
        {
          dataIndex: ['dat', 'name'],
          align: 'center',
          render: (_, record) => {
            if (record.key.startsWith('course-')) {
              const isDiff = record.fpt.code !== record.dat?.code;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.dat?.code || '-'}
                </span>
              );
            } else if (record.key.startsWith('student-')) {
              const isDiff = record.fpt.fullName !== record.dat?.fullName;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.dat?.fullName || '-'}
                </span>
              );
            }
            return '';
          },
        },
        {
          dataIndex: ['dat', 'id'],
          align: 'center',
          render: (_, record) => {
            if (record.key.startsWith('course-')) {
              const isDiff =
                record.fpt.trainingCategory !== record.dat?.trainingCategory;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.dat?.trainingCategory || '-'}
                </span>
              );
            } else if (record.key.startsWith('student-')) {
              const isDiff = record.fpt.birthday !== record.dat?.birthday;
              return (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isDiff ? 'red' : 'green',
                  }}
                >
                  {record.dat?.birthday
                    ? moment(record.dat.birthday).format(dateFormat)
                    : '-'}
                </span>
              );
            }
            return '';
          },
        },
      ],
    },
    {
      title: <div style={{ fontWeight: 'bold' }}>Ghi chú</div>,
      dataIndex: 'note',
      align: 'center',
      render: (_, record) => {
        if (record.key.startsWith('course-')) {
          if (record.isDifferent) {
            return <span style={{ color: 'red' }}>Thông tin khác</span>;
          }
        }
        if (record.key.startsWith('student-')) {
          if (!record.isSync) {
            return <span style={{ color: 'red' }}>Chưa đồng bộ</span>;
          }
          if (record.isDifferent) {
            return <span style={{ color: 'red' }}>Thông tin khác</span>;
          }
        }
        return '';
      },
    },
  ];

  return (
    <>
      <div style={{ marginTop: 10 }}>
        <Button
          type="primary"
          loading={syncDataLoading}
          onClick={async () => {
            const payload = buildPayload(selectedRowKeys, treeData);
            console.log('selectedRowKeys:', selectedRowKeys);
            console.log('selectedRows:', selectedRows);

            // TODO: Gọi API hoặc dispatch action đồng bộ tại đây
            const res = await dispatch({
              type: 'SyncData/syncCourses',
              payload,
            });
            //await refreshStudents(selectedRowKeys, treeData);
          }}
          disabled={selectedRows.length === 0}
        >
          Đồng bộ
        </Button>
      </div>
      <ProTable
        bordered
        columns={columns}
        search={false}
        options={false}
        rowKey="key"
        pagination={false}
        dataSource={treeData}
        expandable={{
          childrenColumnName: 'children',
          onExpand: (expanded, record) => {
            if (expanded) loadChildren(record);
          },
        }}
        rowSelection={{
          checkStrictly: false,
          selectedRowKeys,
          onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedRows(selectedRows);
            console.log('selectedRows:', selectedRows);
          },
          getCheckboxProps: (record) => {
            const isSelectable =
              record.key.startsWith('course-') ||
              record.key.startsWith('student-');
            return {
              style: isSelectable ? {} : { display: 'none' },
            };
          },
        }}
        loading={loading || getStudentsLoading}
        headerTitle="Danh sách học viên theo khóa học"
      />
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          loading={syncDataLoading}
          onClick={async () => {
            const payload = buildPayload(selectedRowKeys, treeData);
            console.log('selectedRows:', selectedRows);

            // TODO: Gọi API hoặc dispatch action đồng bộ tại đây
            const res = await dispatch({
              type: 'SyncData/syncCourses',
              payload,
            });
            //await refreshStudents(selectedRowKeys, treeData);
          }}
          disabled={selectedRows.length === 0}
        >
          Đồng bộ
        </Button>
      </div>
    </>
  );
};

export default connect(({ SyncData, loading }) => ({
  loading: loading.effects['SyncData/queryTableCourses'],
  getStudentsLoading: loading.effects['SyncData/getStudentsByCourseCode'],
  syncDataLoading: loading.effects['SyncData/syncCourses'],
  visitData: SyncData.courseTableData,
}))(SyncCourse);

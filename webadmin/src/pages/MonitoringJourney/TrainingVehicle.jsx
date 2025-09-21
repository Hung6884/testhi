import { Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { formatMessage, useDispatch } from 'umi';
import { dateFormat, datetimeFormat } from '../../utils/constants';
import RouteMap from '../Common/CustomMap/Map';
import './TrainingVehicle.less';
import { Table } from '../../ui/component/Table';
import { isEmpty } from 'lodash';

const TrainingVehicle = () => {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };
  const [form] = Form.useForm();
  const [selectedTypeValue, setSelectedTypeValue] = useState(null);
  const [selectedVehicleCode, setSelectedVehicleCode] = useState(null);
  const [trainingVehicleList, setTrainingVehicleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [studentSessions, setStudentSessions] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDisableSession, setDisableSession] = useState(false);
  const [coords, setCoords] = useState([]);
  const [lastTime, setLastTime] = useState(null);
  const dispatch = useDispatch();

  const getLastPosition = async (vehicleCode) => {
    setDisableSession(true);
    setStudentSessions([]);
    setLastTime(null);
    setCoords([]);
    const sessions = await dispatch({
      type: 'RollCallStudents/findByVehicleCode',
      payload: { vehicleCode },
    });

    if (!isEmpty(sessions)) {
      //tim xem co phien chua logout ko (phien hien tai)
      const sessionWithoutLogout = sessions.find((s) => s.logoutDate == null);
      //nếu có phien dang active => vị trí cuối cùng sẽ lấy trong bảng hàng trình: historyData
      if (sessionWithoutLogout) {
        const latest = !isEmpty(sessionWithoutLogout.historyDatas)
          ? sessionWithoutLogout.historyDatas.reduce((latest, item) => {
              return new Date(item.time) > new Date(latest.time)
                ? item
                : latest;
            })
          : null;

        if (latest) {
          setCoords([{ lat: latest.lat, lng: latest.lng }]);
          setLastTime(moment(latest.time).format(datetimeFormat));
        }
      } else {
        const lastSessionWithLogout = sessions.reduce((latest, item) => {
          return new Date(item.logoutDate) > new Date(latest.logoutDate)
            ? item
            : latest;
        });
        if (lastSessionWithLogout) {
          setCoords([
            { lat: lastSessionWithLogout.lat, lng: lastSessionWithLogout.lng },
          ]);
          setLastTime(
            moment(lastSessionWithLogout.logoutDate).format(datetimeFormat),
          );
        }
      }
    }
  };
  const handleOnChange = (e) => {
    setSelectedTypeValue(e.target.value);
    if (e.target.value == 0) {
      getLastPosition(selectedVehicleCode);
    } else {
      getStudentSession(selectedDate, selectedVehicleCode);
    }
  };
  const handleOnChangeVehicle = async (value) => {
    setSelectedVehicleCode(value);
    if (selectedTypeValue === 1) {
      getStudentSession(selectedDate, value);
    } else if (selectedTypeValue === 0 || selectedTypeValue === null) {
      setSelectedTypeValue(0);
      getLastPosition(value);
    }
  };
  const getTrainingVehicles = async () => {
    const trainingVehices = await dispatch({
      type: 'Vehicles/queryTableData',
    });

    const trainingMapping = (trainingVehices?.list || []).map((t) => ({
      label: t.licensePlate,
      value: t.code,
    }));
    setTrainingVehicleList(trainingMapping);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getStudentSession = async (date, vehicleCode) => {
    setCoords([]);
    setDisableSession(false);
    setLastTime(null);
    if (!date) {
      setStudentSessions([]);
      return;
    }
    const dateValue = date.format('YYYY-MM-DD');
    if (date && vehicleCode) {
      const sessionData = await dispatch({
        type: 'RollCallStudents/findByDateAndVehicleCode',
        payload: { date: dateValue, vehicleCode },
      });
      let session = [];
      if (!isEmpty(sessionData)) {
        sessionData.sort(
          (a, b) => new Date(a.loginDate) - new Date(b.loginDate),
        );
        const output = sessionData.map((item) => ({
          ...item,
          fromTime: item.loginDate ? formatTime(item.loginDate) : '-',
          toTime: item.logoutDate ? formatTime(item.logoutDate) : '-',
        }));

        session = output.map((item, index) => ({
          ...item,
          session: `${index + 1}. ${item.fromTime} - ${item.toTime} - ${
            item.totalDistancesOfSession
          }Km`,
          key: index + 1,
        }));
      }

      setStudentSessions(session);
    } else {
      setStudentSessions([]);
    }
  };

  const onChangeDate = async (value) => {
    setSelectedDate(value);
    if (selectedTypeValue === 1) {
      getStudentSession(value, selectedVehicleCode);
    }
  };

  useEffect(() => {
    setSelectedDate(moment());
    getTrainingVehicles();
    setCoords([{ lat: 18.6796, lng: 105.6813 }]); //Thành phố Vinh
  }, []);

  const columns = useMemo(() => [
    {
      dataIndex: 'session',
      key: 'session',
      className: 'font-size-14',
    },
  ]);

  return (
    <>
      <Form
        form={form}
        labelCol={{ style: { fontWeight: 'bold', width: 100 } }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        onFieldsChange={() => {
          setIsDirty(form.isFieldsTouched(false));
        }}
        onValuesChange={(changedValues) => {}}
        style={{ padding: '0 18px', height: '100%' }}
      >
        <Row gutter={16} style={{ height: '100%' }}>
          <Col
            xs={24}
            lg={6}
            style={{
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid gray',
              gap: 16,
            }}
          >
            <Row>
              <Select
                onChange={handleOnChangeVehicle}
                style={{ width: '90%' }}
                value={selectedVehicleCode}
                showSearch
                allowClear
                options={[...trainingVehicleList]}
                optionFilterProp="label"
                placeholder={formatMessage({
                  id: 'common.training.vehicle.select',
                })}
              />
            </Row>
            <Row>
              <Radio.Group
                style={style}
                value={selectedTypeValue}
                options={[
                  {
                    value: 0,
                    label: `Vị trí cuối cùng ${
                      lastTime ? `lúc ${lastTime}` : ''
                    }`,
                  },
                  {
                    value: 1,
                    label: (
                      <>
                        Phiên học{' '}
                        <DatePicker
                          value={selectedDate}
                          disabled={isDisableSession}
                          onChange={onChangeDate}
                          format={dateFormat}
                          style={{ width: '70%' }}
                        />
                      </>
                    ),
                  },
                ]}
                onChange={handleOnChange}
              />
            </Row>
            <Row
              style={{
                flexGrow: 1,
                border: '1px solid gray',
                overflow: 'auto',
              }}
            >
              {!isEmpty(studentSessions) && (
                <Table
                  rowKey="uuid"
                  className="hidden-checkbox"
                  style={{ width: '100%' }}
                  dataSource={studentSessions}
                  columns={columns}
                  showHeader={false}
                  pagination={false}
                  disabled={isDisableSession}
                  search={false}
                  options={false}
                  bordered
                  locale={{ emptyText: null }}
                  onRow={(record) => ({
                    onClick: () => {
                      setSelectedRowKey(record.key); // manually select row
                      let coordinates = [{ lat: record.lat, lng: record.lng }];
                      if (
                        !isEmpty(record.historyDatas) &&
                        selectedTypeValue === 1
                      ) {
                        coordinates = coordinates.concat(
                          record.historyDatas
                            .sort((a, b) => new Date(a.time) - new Date(b.time))
                            .map((data) => ({ lat: data.lat, lng: data.lng })),
                        );
                      }
                      coordinates.push({
                        lat: record.logoutLat,
                        lng: record.logoutLng,
                      });
                      setCoords(coordinates);
                    },
                  })}
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
                    columnWidth: 0, // Ẩn cột radio
                    renderCell: () => null, // Xoá radio button khỏi ô
                  }}
                  rowClassName={(record) =>
                    record.key === selectedRowKey ? 'selected-row' : ''
                  }
                />
              )}
            </Row>
          </Col>
          <Col xs={24} lg={18}>
            <RouteMap locations={coords}></RouteMap>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default TrainingVehicle;

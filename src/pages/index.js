import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Button,
  Row,
  Col,
  Stack,
  ListGroup,
  Alert,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import DashBoardHeader from "../components/DashBoardHeader";
import styles from "../styles/dashboard.module.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DataTable from "@/components/DataTable";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { API_ENDPOINT } from "@/components/constants";

export default function Home() {
  // uncomment the below line when you add link in axios
  // const [data, setData] = useState([]);

  const percentage = 30;

  const orderStatuses = () => {
    let returnable = {};
    for (let i = 0; i < 10; i++) {
      returnable["Order" + i] =
        Math.floor(Math.random() * 2) + 1 == 1 ? "Complete" : "Incomplete";
    }
    return returnable;
  };

  const ordersFulfilledColumnHeaders = [
    { Header: "Order #", accessor: "order" },
    { Header: "Status", accessor: "status" },
  ];
  const ordersFulfilledMockData = [
    { order: "Order 1", status: "true" },
    { order: "Order 2", status: "false" },
    { order: "Order 3", status: "true" },
    { order: "Order 4", status: "true" },
  ];

  const pieChartData = [
    { id: 0, value: 3, label: "SAT1" },
    { id: 1, value: 15, label: "SAT2" },
    { id: 2, value: 20, label: "SAT3" },
    { id: 3, value: 20, label: "SAT4" },
    { id: 4, value: 40, label: "SAT5" },
  ];

  const [ordersFulfilled, setOrdersFulfilled] = useState(null);

  useEffect(() => {
    setOrdersFulfilled(orderStatuses());
  }, []);

  const satelliteURL = API_ENDPOINT + "/assets/satellites";

  const [satellites, setSatellites] = useState(null);
  const [satellitesPower, setSatellitesPower] = useState(null);
  const [satellitesStorage, setSatellitesStorage] = useState(null);

  useEffect(() => {
    if (satellites !== null) {
      console.log(
        "Satellite Power: ",
        satellites.map((sat) => {
          return { satellite: sat.name, usage: sat.power_capacity };
        })
      );
      console.log(
        "Satellite Storage: ",
        satellites.map((sat) => {
          return { satellite: sat.name, storage: sat.storage_capacity };
        })
      );
      setSatellitesPower(
        satellites.map((sat) => {
          return { satellite: sat.name, usage: sat.power_capacity };
        })
      );
      setSatellitesStorage(
        satellites.map((sat) => {
          return { satellite: sat.name, storage: sat.storage_capacity };
        })
      );
    }
  }, [satellites]);

  useEffect(() => {
    axios
      .get(satelliteURL)
      .then((response) => {
        console.log(response.data);
        setSatellites(response.data);
      })
      .catch((err) => {
        console.log("Satellite Endpoint error: " + JSON(err));
      });
  }, []);

  return (
    <>
      <Head>
        <title>dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dashboard">
        <Sidebar />
        <DashBoardHeader />
        <div className="dashboardContent">
          <br />
          <br />
          <Container>
            <Row style={{ height: "100%" }}>
              <Col lg={6}>
                <Row style={{ height: "50%" }}>
                  <div>
                    <br />
                    <Stack className="align-items-center">
                      <div
                        style={{
                          width: "35%",
                          height: "35%",
                          textSize: "15px",
                        }}
                      >
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage}%`}
                        />
                      </div>
                    </Stack>
                  </div>
                </Row>
                <br />
                <Row style={{ height: "50%" }}>
                  <div>
                    <br />
                    {/* <h5 className="text-center">
                      Satellite Orders and their statuses
                    </h5> */}
                    <DataTable
                      search={false}
                      tablePagination={true}
                      actionBtn={true}
                      rowSeletion={false}
                      columns={ordersFulfilledColumnHeaders}
                      data={ordersFulfilledMockData}
                    />
                  </div>
                </Row>
              </Col>
              <Col>
                <Row style={{ height: "50%" }}>
                  <div>
                    <Stack className="align-items-center">
                      {/* <h6>Asset Power</h6> */}
                      <div>
                        {satellitesPower !== null && (
                          <BarChart
                            dataset={satellitesPower}
                            yAxis={[
                              { scaleType: "band", dataKey: "satellite" },
                            ]}
                            series={[
                              {
                                dataKey: "usage",
                                label: "Usage",
                                color: "#76b7b2",
                              },
                            ]}
                            layout="horizontal"
                            {...{
                              xAxis: [
                                {
                                  label: "Power Capacity",
                                },
                              ],
                              width: "270",
                              height: "270",
                            }}
                          />
                        )}
                      </div>
                    </Stack>
                  </div>
                </Row>
                <br />
                <Row style={{ height: "50%" }}>
                  <div>
                    <Stack className="align-items-center">
                      {/* <h6>Asset Storage</h6> */}
                      <div>
                        {satellitesStorage !== null && (
                          <BarChart
                            dataset={satellitesStorage}
                            yAxis={[
                              { scaleType: "band", dataKey: "satellite" },
                            ]}
                            series={[
                              {
                                dataKey: "storage",
                                label: "Storage",
                                color: "#4e79a7",
                              },
                            ]}
                            layout="horizontal"
                            {...{
                              xAxis: [
                                {
                                  label: "Storage",
                                },
                              ],
                              width: "270",
                              height: "270",
                            }}
                          />
                        )}
                      </div>
                    </Stack>
                  </div>
                </Row>
              </Col>
            </Row>
            <br />
            <br />
            <hr />
            <br />

            <Row>
              <Col>
                <div>
                  <Stack className="align-items-center">
                    <h5>Asset Order Amounts</h5>
                    <div>
                      <PieChart
                        series={[
                          {
                            data: pieChartData,
                            highlightScope: {
                              faded: "global",
                              highlighted: "item",
                            },
                            faded: {
                              innerRadius: 30,
                              additionalRadius: -30,
                              color: "gray",
                            },
                          },
                        ]}
                        height={300}
                        width={300}
                      />
                    </div>
                  </Stack>
                </div>
              </Col>
              <Col>
                <div>
                  <Stack className="align-items-center">
                    <h5>System Alerts</h5>
                    <br />
                    <Alert variant="danger">SOSO-1 Satellite is down</Alert>
                    <Alert variant="success">Schedule #8129 completed</Alert>
                    <Alert variant="warning">
                      SOSO-3 is about to enter eclipse
                    </Alert>
                  </Stack>
                </div>
              </Col>
            </Row>
            <br />
            <hr />
            <br />
          </Container>
        </div>
      </main>
    </>
  );
}

import React, { useState } from "react";
import Head from 'next/head'
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import DashBoardHeader from '../components/DashBoardHeader'
import SatelliteModal from '../components/SatelliteModal'
import styles from '../styles/dashboard.module.scss'

export default function AddSAT() {
  const [hideShowSidebar, setHideShowSidebar] = useState(true);
  const [checkJson, setCheckJson] = useState();
  const [jsonFileName, setJsonFileName] = useState("");
  const [modalShow, setModalShow] = useState("");
  const jsonFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/json' || file.type === 'text/plain' || /\.(json|txt)$/i.test(file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          try {
            if (file.type === 'application/json') {
              // const jsonData = JSON.parse(fileContent);
              // Handle JSON data
              setJsonFileName(file.name);
              setCheckJson(false);
            } else if (file.type === 'text/plain') {
              // Handle text file data
              setJsonFileName(file.name);
              setCheckJson(false);
            }
          } catch (error) {
            setJsonFileName("Upload only JSON File");
            setCheckJson(true);
          }
        };
        reader.readAsText(file);
      } else {
        setJsonFileName("Invalid file type. Please upload .json or .text file.");
        setCheckJson(true);
      }
    }
  };

  return (
    <>
      <Head>
        <title>dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='dashboard'>
        <DashBoardHeader 
          setHideShowSidebar = {setHideShowSidebar}
          hideShowSidebar = {hideShowSidebar}
        />
        <Sidebar 
          hideShowSidebar={hideShowSidebar}
        />
        <div className={hideShowSidebar ? "dashboardContent" : "dashboardContent sidebar--open"}>
          <div className={styles.dashboardMainContent}>
            <Container className={styles.container}>
              <div className={styles.addSatelliteForm}>
                <h4>Add Satellite to SOSO Constellation</h4>
                  <Form>
                    <Row className={styles.formRow}>
                      <Col md={12} className={styles.formGroup}>
                          <div className={styles.uploadFile}>
                            <input type="file" accept=".json, .txt" onChange={jsonFileUpload} />
                            <span className={checkJson ? styles.red : ""}>{jsonFileName ? jsonFileName : "Upload only JSON or Text File"}</span>
                          </div>
                          <Button type="button" className={styles.submitBtn} onClick={() => setModalShow(true)}>Submit</Button>
                      </Col>
                    </Row>
                  </Form>
              </div>
            </Container>
          </div>
        </div>
      </main>
      <SatelliteModal 
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

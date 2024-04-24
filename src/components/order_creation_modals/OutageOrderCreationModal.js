import React, { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Modal } from 'react-bootstrap'
import styles from '../../styles/dashboard.module.scss'
import OrderCreationSuccessModal from './OrderCreationSuccessModal';
import { Typeahead } from 'react-bootstrap-typeahead';
import Datetime from 'react-datetime'
import "react-datetime/css/react-datetime.css";
import axios from 'axios'


export default function OutageOrderCreationModal({showModal, setShowModal}) {
  const [modalShow, setModalShow] = useState(false);
  const [satelliteNames, setSatelliteNames] = useState([]);
  const [groundstationNames, setGroundstationNames] = useState([])
  const [orderId, setOrderId] = useState(undefined)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const handleSubmit = () => {
    setModalShow(true)
    setShowModal(false)
  }

  let fetchAssetNames = async () => {
    let base_url = process.env.NEXT_PUBLIC_BASE_API_URL
    let response = await axios.get(`${base_url}/assets/names`)
    setSatelliteNames(response.data.satellites)
    setGroundstationNames(response.data.groundstations)
  }

  useEffect(() => {
    fetchAssetNames()
  }, [])

  return <>
    <Modal 
      size="lg"
      show={showModal} 
      onHide={() => setShowModal(false)}
      className={styles.customModal} 
      centered
      >
      <Modal.Header className={styles.customModalHeader} closeButton>
        <Modal.Title className={styles.customModalTitle}>Outage Requests Form</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.customModalBody}>
        <Form className={styles.customForm}>
          <Row className={styles.formRow}>
            <Form.Group as={Col} md="12" className={styles.formCol}>
              <div className={styles.materialInput}>
                <Typeahead
                  id="target-typeahead"
                  options={satelliteNames.concat(groundstationNames)}
                  placeholder="Target"
                  required
                />
                <span className={styles.inputBar}></span>
              </div>
            </Form.Group>
            <Form.Group as={Col} md="6" className={styles.formCol}>
              <div className={styles.materialInput}>
                <Datetime value={startTime} onChange={setStartTime} inputProps={{placeholder: 'Start Time'}}/>
              </div>
            </Form.Group>
            <Form.Group as={Col} md="6" className={styles.formCol}>
              <div className={styles.materialInput}>
                <Datetime value={endTime} onChange={setEndTime} inputProps={{placeholder: 'End Time'}}/>
              </div>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className={styles.customModalFooter}>
        <Button type="button" className={styles.dismissBtn} onClick={() => setShowModal(false)}>Dismiss</Button>
        <Button type="button" className={styles.submitBtn} onClick={handleSubmit}>Submit Data</Button>
      </Modal.Footer>
    </Modal>
    <OrderCreationSuccessModal
      show={modalShow}
      onHide={() => setModalShow(false)}
      orderId={orderId}
    />
  </>
}

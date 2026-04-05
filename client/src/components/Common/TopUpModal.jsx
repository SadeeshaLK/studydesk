import { useState } from 'react';
import { Modal, Button, message, InputNumber, Upload } from 'antd';
import {
  // CreditCardOutlined,
  // LockOutlined,
  // SafetyCertificateOutlined,
  // CheckCircleOutlined,
  WalletOutlined,
  BankOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import api from '../../api/axios';

const presetAmounts = [500, 1000, 2000, 5000, 10000];

const TopUpModal = ({ open, onClose, onTopUpSuccess, currentBalance = 0 }) => {
  const [method] = useState('manual'); // card method disabled for now
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(500);
  // const [cardNumber, setCardNumber] = useState('');
  // const [expiry, setExpiry] = useState('');
  // const [cvv, setCvv] = useState('');
  // const [cardName, setCardName] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  // const [success, setSuccess] = useState(false);
  // const [newBalance, setNewBalance] = useState(0);

  // const formatCardNumber = (value) => {
  //   const v = value.replace(/\D/g, '').slice(0, 16);
  //   return v.replace(/(.{4})/g, '$1 ').trim();
  // };

  // const formatExpiry = (value) => {
  //   const v = value.replace(/\D/g, '').slice(0, 4);
  //   if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
  //   return v;
  // };

  const isFormValid = () => {
    if (amount < 500) return false;
    // Card validation disabled for now
    // if (method === 'card') {
    //   return cardNumber.replace(/\s/g, '').length === 16 &&
    //     expiry.length === 5 &&
    //     cvv.length >= 3 &&
    //     cardName.trim().length > 0;
    // }
    if (method === 'manual') {
      return slipFile !== null;
    }
    return false;
  };

  const handleTopUp = async () => {
    if (!isFormValid()) {
      message.warning('Please fill all details correctly. Minimum top-up is LKR 500.');
      return;
    }

    setLoading(true);
    try {
      // Card payment disabled for now
      // if (method === 'card') {
      //   const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4);
      //   const { data } = await api.post('/payments/topup', { amount, cardLast4 });
      //   setNewBalance(data.walletBalance);
      //   setSuccess(true);
      //   message.success(data.message);
      //   setTimeout(() => { onTopUpSuccess(data.walletBalance); handleClose(); }, 1500);
      // } else if (method === 'manual') {
      if (method === 'manual') {
        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('slip', slipFile);

        const { data } = await api.post('/payments/manual-topup', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        message.success(data.message);
        setTimeout(() => { handleClose(); }, 1500);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount(500);
    // setCardNumber('');
    // setExpiry('');
    // setCvv('');
    // setCardName('');
    setSlipFile(null);
    // setSuccess(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={480}
      centered
      destroyOnClose
    >
      <>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontSize: 28, color: '#fff'
          }}>
            <WalletOutlined />
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Top Up Wallet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Current balance: <strong>LKR {currentBalance.toLocaleString()}</strong>
          </p>
        </div>

        {/* Payment method toggle — Card option disabled for now */}
        {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Radio.Group value={method} onChange={e => setMethod(e.target.value)} buttonStyle="solid">
            <Radio.Button value="card"><CreditCardOutlined /> Card</Radio.Button>
            <Radio.Button value="manual"><BankOutlined /> Bank Transfer</Radio.Button>
          </Radio.Group>
        </div> */}

        {/* Amount Selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Select Amount (min. LKR 500)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {presetAmounts.map(preset => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                style={{
                  flex: '1 1 auto', minWidth: 80, padding: '10px 16px',
                  border: `2px solid ${amount === preset ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 10,
                  background: amount === preset ? 'var(--primary-bg, rgba(22,119,255,0.08))' : 'var(--bg-secondary)',
                  color: amount === preset ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: amount === preset ? 700 : 500,
                  fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                LKR {preset.toLocaleString()}
              </button>
            ))}
          </div>
          <InputNumber
            min={500}
            value={amount}
            onChange={v => setAmount(v || 500)}
            style={{ width: '100%' }}
            size="large"
            addonBefore="LKR"
            placeholder="Custom amount (min 500)"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/,/g, '')}
          />
        </div>

        {/* Card form — disabled for now */}
        {/* {method === 'card' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Cardholder Name</label>
              <Input placeholder="JOHN DOE" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} size="large" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Card Number</label>
              <Input prefix={<CreditCardOutlined />} placeholder="0000 0000 0000 0000" value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} size="large" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label>Expiry</label>
                <Input placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} maxLength={5} size="large" />
              </div>
              <div>
                <label>CVV</label>
                <Input prefix={<LockOutlined />} placeholder="•••" value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} size="large" type="password" />
              </div>
            </div>
          </>
        )} */}

        {/* Manual / Bank Transfer */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px',
            border: '1px dashed var(--border-color)', marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}><BankOutlined /> Bank Details</h4>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Bank:</strong> Dialog Finance PLC</div>
              <div><strong>Branch:</strong> Head Office</div>
              <div><strong>Account Name:</strong> StudyDesk</div>
              <div><strong>Account Number:</strong>{' '}
                <span style={{
                  background: 'var(--primary-bg, #e6f4ff)', color: 'var(--primary, #1677ff)',
                  padding: '2px 6px', borderRadius: '4px',
                  border: '1px solid var(--border-color)', fontWeight: 'bold'
                }}>0010 2003 2293</span>
              </div>
              <div style={{ marginTop: '8px', color: 'var(--primary)', fontWeight: '600' }}>
                * Add your name as remarks
              </div>
            </div>
          </div>

          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Upload Payment Slip
          </label>
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/*,application/pdf"
            beforeUpload={(file) => {
              const isImageOrPdf = file.type.startsWith('image/') || file.type === 'application/pdf';
              if (!isImageOrPdf) {
                message.error('You can only upload Image or PDF files!');
                return Upload.LIST_IGNORE;
              }
              setSlipFile(file);
              return false;
            }}
            onRemove={() => setSlipFile(null)}
          >
            <Button icon={<UploadOutlined />} style={{ width: '100%' }}>Click to Upload</Button>
          </Upload>
        </div>

        {/* Balance preview */}
        <div style={{
          background: 'var(--bg-primary)', borderRadius: 10, padding: 14, marginBottom: 16,
          border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: 14
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Balance after top-up:</span>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: 12 }}>Pending Approval</span>
        </div>

        <Button
          type="primary"
          block
          size="large"
          onClick={handleTopUp}
          loading={loading}
          disabled={!isFormValid()}
          style={{
            height: 48, fontSize: 15, fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none'
          }}
        >
          {`Submit LKR ${(amount || 0).toLocaleString()} for Approval`}
        </Button>

        {/* Card security badge — disabled for now */}
        {/* {method === 'card' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: 'var(--text-muted)', fontSize: 12 }}>
            <SafetyCertificateOutlined />
            <span>Secure payment · Your card details are safe</span>
          </div>
        )} */}
      </>
    </Modal>
  );
};

export default TopUpModal;

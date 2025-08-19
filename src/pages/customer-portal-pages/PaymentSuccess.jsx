import { useState, useEffect } from "react";
import { CheckCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const PaymentSuccess = () => {
    return (
        <div>
                <div className="w-full h-screen flex flex-col items-center justify-center">
                    <CheckCircleOutlined />
                    <span>Payment successful!</span>
                    <div className="flex space-x-4 mt-4">
                        <Button>Continue Shopping</Button>
                    </div>
                </div>
        </div>
    );
};

export default PaymentSuccess;
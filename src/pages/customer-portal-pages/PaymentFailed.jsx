import React from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const PaymentFailed = () => {
    return (
        <div>
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <ExclamationCircleOutlined />
                <span>Payment failed. Please try again.</span>
                <div className="flex space-x-4 mt-4">
                    <Button>Retry</Button>
                    <Button>Return to homepage</Button>
                </div>
            </div>
        </div>
    )
}

export default PaymentFailed;

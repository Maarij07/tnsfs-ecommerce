import React from 'react';
import { Row, Col } from 'antd';
import { FacebookOutlined, InstagramOutlined, WhatsAppOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Import Ant Design styles

const Footer = () => {
    return (
        <div className='bg-[#3563E9] text-white sm:h-[55vh] p-8 flex items-center justify-center'>
            <Row gutter={[16, 16]} className='w-full'>
                {/* Column 1 */}
                <Col xs={24} sm={12} md={6} className='flex flex-col items-center'>
                    <h2 className='font-bold text-lg text-center'>Website Name</h2>
                    <p className='text-center'>Project By tsnfs</p>
                </Col>

                {/* Column 2 */}
                <Col xs={24} sm={12} md={6} className='flex flex-col items-center'>
                    <h2 className='font-bold text-lg text-center'>Contact Us</h2>
                    <ul className='list-none text-center'>
                        <li>Store Locations</li>
                        <li>Help</li>
                        <li>Q&A</li>
                    </ul>
                </Col>

                {/* Column 3 */}
                <Col xs={24} sm={12} md={6} className='flex flex-col items-center'>
                    <h2 className='font-bold text-lg text-center'>Reviews</h2>
                    <ul className='list-none text-center'>
                        <li>Contacts</li>
                        <li>Portfolio</li>
                    </ul>
                </Col>

                {/* Column 4 */}
                <Col xs={24} sm={12} md={6} className='flex flex-col items-center'>
                    <h2 className='font-bold text-lg text-center'>Follow Us</h2>
                    <ul className='list-none flex flex-col gap-2 items-center'>
                        <li className='flex items-center'>
                            Follow us on Facebook
                        </li>
                        <li className='flex items-center'>
                            Follow us on Instagram
                        </li>
                        <li className='flex items-center'>
                            Join us on WhatsApp
                        </li>
                        <li className='flex items-center'>
                            <FacebookOutlined className="text-white text-2xl mr-2" />
                            <InstagramOutlined className="text-white text-2xl mr-2" />
                            <WhatsAppOutlined className="text-white text-2xl mr-2" />
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default Footer;

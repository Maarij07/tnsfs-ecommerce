import React from 'react';
import { useLocalContext } from '../context/context';  // Import LocalContext hook
import { Button, List, Typography } from 'antd';

const { Title } = Typography;

const Cart = () => {
  const { cart, removeFromCart } = useLocalContext();  // Get cart state and functions from LocalContext

  return (
    <div className='p-8 bg-white shadow-md rounded-lg'>
      <Title level={2}>Your Cart</Title>
      {cart.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type='text'
                  danger
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`Category: ${item.category} | Price: Rs. ${(parseFloat(item.price) || 0).toFixed(2)}`}
                // Display the product's image
                avatar={<img src={item.images[0]?.url} alt={item.name} className='w-16 h-16 object-cover rounded-lg' />}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Cart;

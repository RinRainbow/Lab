import React from 'react';
import { Button, Flex } from 'antd';



export default function SelectData() {
    return (
      <div className="whiteBox shadow">
        <div className='data card' style={{padding: '30px 30px 15px 30px'}}>
          
        </div>
        <div className='button set' style={{padding: '15px 30px 30px 0px'}}>
          <Flex justify="flex-end" align='flex-end' gap="small" wrap>
          <Button>Back</Button>
            <Button type="primary">Save</Button>
          </Flex>
          {/* <Flex justify="flex-start" align='flex-end' gap="small" wrap>
            <Button type="primary">Back</Button>
          </Flex> */}
        </div>
        
      </div>
    );
}
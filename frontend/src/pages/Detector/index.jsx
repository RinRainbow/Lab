import React from 'react';
import { Card, Button, Flex } from 'antd';

const gridStyle = {
  width: '100%',
  heigth: '100%',
  textAlign: 'center',
};

export default function Detector() {
    return (
      <div className="whiteBox shadow">
        <div className='button set' style={{padding: '30px 30px 0px 0px'}}>
          <Flex justify="flex-end" gap="small" wrap>
            <Button type="primary">Train</Button>
            <Button href='/detectorSetting'>Create</Button>
            <Button danger>Delete</Button>
          </Flex>
        </div>
        <div className='data card' style={{padding: '15px 30px 30px 30px'}}>
          <Card>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              Content
            </Card.Grid>
          </Card>
        </div>
        
      </div>
    );
  }  
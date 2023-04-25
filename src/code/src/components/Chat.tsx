import { Input, Row, Col, Button, Card, message } from 'antd';
import React from 'react';
import { getEndpoint } from '@/utils/api';

async function chat(history: { user: boolean; content: string }[]) {
  const resp = await fetch(`${getEndpoint()}/chat`, {
    method: 'post',
    body: JSON.stringify(
      history.slice(Math.max(0, history.length - 10), history.length),
    ),
  });
  const data = await resp.json();
  return data?.text;
}

export function Chat() {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState<
    {
      user: boolean;
      content: string;
    }[]
  >([]);

  React.useEffect(() => {
    // prewarm
    chat([])
  }, [])
  
  return (
    <div style={{ width: '80%', margin: '0 10%' }}>
      <div style={{ height: '100%' }}>
        {history.map((item) => {
          return item.user ? (
            <div style={{ width: '100%', margin: '0.5em' }}>
              <b>用户</b>: {item.content}
            </div>
          ) : (
            <Card style={{ margin: '2em 0' }}>
              <div style={{ marginBottom: '1em' }}>
                <b>小元</b>
              </div>

              {item.content}
            </Card>
          );
        })}
      </div>

      <Row gutter={8} style={{ margin: 32 }}>
        <Col flex="auto">
          <Input
            value={value}
            onChange={(e) => setValue(e?.target?.value || '')}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              if (!!value) {
                setLoading(true);
                const newHistory = [...history, { user: true, content: value }];
                setHistory(newHistory);
                setValue('');

                console.log(newHistory);
                chat(newHistory)
                  .then((result) => {
                    setHistory([
                      ...newHistory,
                      { user: false, content: result },
                    ]);
                  })
                  .catch((err) => {
                    console.error(err);
                    message.error('查询失败');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            }}
          >
            发送
          </Button>
        </Col>
      </Row>
    </div>
  );
}

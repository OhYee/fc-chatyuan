import { Chat } from '@/components/Chat';
import { Card, Space, Typography } from 'antd';

export default function HomePage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Typography.Title>元语功能型对话大模型</Typography.Title>

        <Typography.Paragraph>
          hatYuan: 元语功能型对话大模型
         <br/>
          <b>文本由模型生成的结果, 请谨慎辨别和参考, 不代表任何人观点</b>
        </Typography.Paragraph>

        <Typography.Link href="https://modelscope.cn/models/ClueAI/ChatYuan-large/summary">
          模型链接
        </Typography.Link>
      </Card>

      <Chat />
    </Space>
  );
}

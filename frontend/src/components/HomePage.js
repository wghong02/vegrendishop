import {
	Button,
	Card,
	Form,
	Image,
	Input,
	List,
	message,
	Tabs,
	Tooltip,
	Typography,
} from "antd";

import { useEffect, useState } from "react";
import { searchCrafts, checkout, deleteApp } from "../utils";
import PostCrafts from "./PostCrafts";

const { TabPane } = Tabs;
const { Text } = Typography;

const BrowseCrafts = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		handleSearch();
	}, []);

	const handleSearch = async (query) => {
		setLoading(true);
		try {
			const resp = await searchCrafts(query);
			setData(resp || []);
		} catch (error) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Form onFinish={handleSearch} layout="inline">
				<Form.Item label="Title" name="title">
					<Input />
				</Form.Item>

				<Form.Item label="Description" name="description">
					<Input />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Search
					</Button>
				</Form.Item>
			</Form>
			<List
				loading={loading}
				grid={{
					gutter: 16,
					xs: 1,
					sm: 3,
					md: 3,
					lg: 3,
					xl: 4,
					xxl: 4,
				}}
				dataSource={data}
				renderItem={(item) => (
					<List.Item>
						<Card
							key={item.id}
							title={
								<Tooltip title={item.description}>
									<Text ellipsis={true} style={{ maxWidth: 150 }}>
										{item.title}
									</Text>
								</Tooltip>
							}
							extra={<Text type="secondary">${item.price}</Text>}
							actions={[
								<Button
									shape="round"
									type="primary"
									onClick={() => checkout(item.id)}
								>
									Checkout
								</Button>,
								<Button
									danger
									shape="round"
									type="primary"
									onClick={() => deleteApp(item.id)}
								>
									Delete
								</Button>,
							]}
						>
							<Image src={item.url} width="100%" />
						</Card>
					</List.Item>
				)}
			/>
		</>
	);
};

const HomePage = ({ userId }) => {
	return (
		<Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
			<TabPane tab="Browse Crafts" key="1">
				<BrowseCrafts />
			</TabPane>

			<TabPane tab="Post Crafts" key="2">
				<PostCrafts />
			</TabPane>
		</Tabs>
	);
};

export default HomePage;

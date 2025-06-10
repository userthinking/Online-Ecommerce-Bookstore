import React from 'react';
import { message, DatePicker, Table } from 'antd';
import * as orderService from '../services/orderService';
import { getUsers } from '../services/userService';

const { RangePicker } = DatePicker;

export class UserSalesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            userList: [],
            showUserList: [],
            loading: true
        };
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user === null) {
            message.error("Please login");
        } else if (user.userType !== 'admin') {
            message.error("You don't have permission");
        } else {
            this.fetchOrder();
        }
    }

    fetchOrder = () => {
        const callback = (data) => {
            if (data) {
                let orderList = [];
                for (let order of data) {
                    let totalPrice = 0;
                    for (let item of order.orderItemList) {
                        totalPrice += item.price * item.bookNumber;
                    }
                    orderList.push({
                        orderDate: order.time.substring(0, 10),
                        price: totalPrice,
                        userId: order.userId,
                        username: order.username
                    });
                }
                this.setState({
                    orderList: orderList,
                    loading: false
                }, () => {
                    this.fetchUser();
                });
            }
        };
        orderService.getOrder(callback);
    }

    fetchUser = () => {
        const callback = (data) => {
            if (data) {
                let userList = new Array(data.length);
                for (let user of data) {
                    userList[user.userId - 1] = {
                        username: user.username,
                        cost: 0
                    };
                }
                for (let order of this.state.orderList) {
                    if (userList[order.userId - 1]) {
                        userList[order.userId - 1].cost += order.price;
                    }
                }
                let showUserList = userList.filter(user => user && user.cost > 0);
                this.setState({
                    userList: userList,
                    showUserList: showUserList.sort((a, b) => b.cost - a.cost)
                });
            }
        };
        getUsers(callback);
    }

    timeChange = (_, dateString) => {
        if (!dateString || dateString.length !== 2) return;
        
        const startTime = new Date(Date.parse(dateString[0]));
        const endTime = new Date(Date.parse(dateString[1]));
        let arr = [];
        for (let order of this.state.orderList) {
            let time = new Date(Date.parse(order.orderDate));
            if ((startTime === '' || time >= startTime) && (endTime === '' || time <= endTime)) {
                arr.push(order);
            }
        }
        let newUserList = JSON.parse(JSON.stringify(this.state.userList));
        for (let user of newUserList) {
            if (user) user.cost = 0;
        }
        for (let order of arr) {
            if (newUserList[order.userId - 1]) {
                newUserList[order.userId - 1].cost += order.price;
            }
        }
        let filteredList = newUserList.filter(user => user && user.cost > 0);
        this.setState({
            showUserList: filteredList.sort((a, b) => b.cost - a.cost)
        });
    }

    render() {
        const columns = [
            {
                title: 'Rank',
                dataIndex: 'rank',
                key: 'rank',
                render: (_, __, index) => index + 1
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: 'Total Cost',
                dataIndex: 'cost',
                key: 'cost',
                render: (cost) => `$${(cost / 100).toFixed(2)}`
            }
        ];

        return (
            <div>
                <br />
                <RangePicker onChange={this.timeChange} />
                <br />
                <br />
                <Table 
                    columns={columns}
                    dataSource={this.state.showUserList}
                    loading={this.state.loading}
                    rowKey="username"
                />
            </div>
        );
    }
}
import React from 'react';
import { Table, DatePicker, message } from 'antd';
import * as orderService from '../services/orderService';
import { getBooks } from "../services/bookService";

const { RangePicker } = DatePicker;

export class BookSalesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderItems: [],
            bookList: [],
            showBookList: [],
            totalPrice: 0,
            totalNumber: 0,
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

    fetchBook = () => {
        const callback = (data) => {
            if (data) {
                let bookList = new Array(data.length);
                let totalPrice = 0;
                let totalNumber = 0;
                for (let book of data) {
                    bookList[book.bookId - 1] = {
                        bookName: book.bookName,
                        imageUrl: book.imageUrl,
                        author: book.author,
                        bookNumber: 0,
                        totalSales: 0
                    };
                }
                for (let orderitem of this.state.orderItems) {
                    if (bookList[orderitem.bookId - 1]) {
                        bookList[orderitem.bookId - 1].bookNumber += orderitem.bookNumber;
                        bookList[orderitem.bookId - 1].totalSales += orderitem.bookNumber * orderitem.price;
                        totalPrice += orderitem.bookNumber * orderitem.price;
                        totalNumber += orderitem.bookNumber;
                    }
                }
                let showBookList = bookList.filter(book => book && book.bookNumber > 0);
                this.setState({
                    bookList: bookList,
                    showBookList: showBookList.sort((a, b) => b.bookNumber - a.bookNumber),
                    totalNumber: totalNumber,
                    totalPrice: totalPrice,
                    loading: false
                });
            }
        };
        getBooks({ "search": null }, callback);
    }

    fetchOrder = () => {
        const callback = (data) => {
            if (data) {
                let orderItemList = [];
                for (let order of data) {
                    for (let item of order.orderItemList) {
                        orderItemList.push({
                            bookId: item.bookId,
                            bookNumber: item.bookNumber,
                            price: item.price,
                            orderDate: order.time.substring(0, 10),
                        });
                    }
                }
                this.setState({
                    orderItems: orderItemList,
                }, () => {
                    this.fetchBook();
                });
            }
        };
        orderService.getOrder(callback);
    }

    timeChange = (_, dateString) => {
        if (!dateString || dateString.length !== 2) return;
        
        const startTime = new Date(Date.parse(dateString[0]));
        const endTime = new Date(Date.parse(dateString[1]));
        let arr = [];
        for (let orderitem of this.state.orderItems) {
            let time = new Date(Date.parse(orderitem.orderDate));
            if ((startTime === '' || time >= startTime) && (endTime === '' || time <= endTime)) {
                arr.push(orderitem);
            }
        }
        let newBookList = JSON.parse(JSON.stringify(this.state.bookList));
        let totalPrice = 0;
        let totalNumber = 0;
        for (let book of newBookList) {
            if (book) {
                book.bookNumber = 0;
                book.totalSales = 0;
            }
        }
        for (let orderitem of arr) {
            if (newBookList[orderitem.bookId - 1]) {
                newBookList[orderitem.bookId - 1].bookNumber += orderitem.bookNumber;
                newBookList[orderitem.bookId - 1].totalSales += orderitem.bookNumber * orderitem.price;
                totalPrice += orderitem.bookNumber * orderitem.price;
                totalNumber += orderitem.bookNumber;
            }
        }
        let filteredList = newBookList.filter(book => book && book.bookNumber > 0);
        this.setState({
            showBookList: filteredList.sort((a, b) => b.bookNumber - a.bookNumber),
            totalNumber: totalNumber,
            totalPrice: totalPrice
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
                title: 'Book Cover',
                dataIndex: 'imageUrl',
                key: 'imageUrl',
                render: (imageUrl) => (
                    <img src={imageUrl} alt="book cover" style={{ width: 50, height: 70 }} />
                )
            },
            {
                title: 'Book Name',
                dataIndex: 'bookName',
                key: 'bookName'
            },
            {
                title: 'Author',
                dataIndex: 'author',
                key: 'author'
            },
            {
                title: 'Units Sold',
                dataIndex: 'bookNumber',
                key: 'bookNumber',
                sorter: (a, b) => a.bookNumber - b.bookNumber
            },
            {
                title: 'Total Sales',
                dataIndex: 'totalSales',
                key: 'totalSales',
                render: (totalSales) => `$${(totalSales / 100).toFixed(2)}`,
                sorter: (a, b) => a.totalSales - b.totalSales
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
                    dataSource={this.state.showBookList}
                    loading={this.state.loading}
                    rowKey="bookName"
                    pagination={{ pageSize: 10 }}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={5}>
                                Total Sales
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                ${(this.state.totalPrice / 100).toFixed(2)}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        );
    }
}

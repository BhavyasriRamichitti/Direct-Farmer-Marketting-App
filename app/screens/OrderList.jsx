import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Sample orders data
const ordersData = [
  {
    id: "#ORD1234",
    customer: "John Doe",
    date: "August 28, 2024",
    products: "50 kg Wheat, 100 kg Rice",
    amount: "Rs 500",
    status: "Pending",
    expectedDelivery: "September 5, 2024",
    paymentStatus: "Unpaid",
  },
  {
    id: "#ORD1422",
    customer: "Prabhas",
    date: "September 5, 2024",
    products: "50 kg Tomatoes, 100 kg Rice",
    amount: "Rs 1200",
    status: "Delivered",
    actualDelivery: "September 10, 2024",
    paymentStatus: "Paid",
  },
  {
    id: "#ORD1922",
    customer: "Venkat",
    date: "August 26, 2024",
    products: "50 kg Onions",
    amount: "Rs 4000",
    status: "Pending",
    expectedDelivery: "September 1, 2024",
    paymentStatus: "Unpaid",
  },
  {
    id: "#ORD5678",
    customer: "Jane Smith",
    date: "July 20, 2024",
    products: "200 kg Corn",
    amount: "Rs 300",
    status: "Delivered",
    actualDelivery: "July 25, 2024",
    paymentStatus: "Paid",
  },
];

// Order List Component
const OrderList = () => {
  const [filter, setFilter] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewPaymentHistory, setViewPaymentHistory] = useState(false);

  // Filter orders based on the selected filter (All, Pending, Delivered)
  const filteredOrders = ordersData.filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  // Filter paid orders for Payment History
  const paidOrders = ordersData.filter((order) => order.paymentStatus === "Paid");

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Order Management</Text>

        {/* Hamburger Menu Icon */}
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={32} color="#6A994E" />
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => {
              setFilter("All");
              setMenuVisible(false);
              setViewPaymentHistory(false);
            }}
          >
            <Text style={styles.menuItem}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFilter("Pending");
              setMenuVisible(false);
              setViewPaymentHistory(false);
            }}
          >
            <Text style={styles.menuItem}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFilter("Delivered");
              setMenuVisible(false);
              setViewPaymentHistory(false);
            }}
          >
            <Text style={styles.menuItem}>Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setViewPaymentHistory(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuItem}>Payment History</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order List or Payment History */}
      <ScrollView>
        {viewPaymentHistory ? (
          paidOrders.length === 0 ? (
            <Text style={styles.noOrdersText}>No payment history found</Text>
          ) : (
            paidOrders.map((order) => (
              <View key={order.id} style={styles.paymentHistoryItem}>
                <View style={styles.row}>
                  <Text style={styles.paymentTextBold}>Retailer: {order.customer}</Text>
                  <Text style={styles.amountText}> {order.amount}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.paymentText}>Order ID: {order.id}</Text>
                  <Text style={styles.paidStatus}>Paid</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.paymentText}>Products: {order.products}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.paymentText}>Delivery Date: {order.actualDelivery}</Text>
                </View>
                <View style={styles.divider} />
              </View>
            ))
          )
        ) : filteredOrders.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders found for {filter} status</Text>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.row}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.statusBadge(order.status)}>{order.status}</Text>
              </View>
              <Text style={styles.customerName}>{order.customer}</Text>
              <Text style={styles.orderDate}>Order Date: {order.date}</Text>
              <Text style={styles.products}>{order.products}</Text>
              <Text style={styles.amount}>Amount: {order.amount}</Text>
              {order.status === "Pending" && (
                <Text style={styles.deliveryDate}>
                  Expected Delivery: {order.expectedDelivery}
                </Text>
              )}
              {order.status === "Delivered" && (
                <Text style={styles.deliveryDate}>
                  Delivered on: {order.actualDelivery}
                </Text>
              )}
              <Text style={styles.paymentStatus}>
                Payment Status: {order.paymentStatus}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Styling for the component
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#EDF7E1",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 28, // Increased font size
    fontWeight: "bold",
    color: "#6A994E",
  },
  menu: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
  },
  menuItem: {
    padding: 15, // Increased padding
    fontSize: 20, // Increased font size
    color: "#6A994E",
    borderBottomWidth: 1,
    borderBottomColor: "#6A994E",
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#6A994E",
    borderRadius: 10,
    padding: 20, 
    marginBottom: 15,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15, 
  },
  orderId: {
    fontSize: 18, 
    fontWeight: "bold",
    color: "#6A994E",
  },
  customerName: {
    fontSize: 18, 
    color: "#6A994E",
    fontWeight: "bold",
    marginBottom: 10, 
  },
  orderDate: {
    fontSize: 16, 
    color: "#6A994E",
    marginBottom: 10, 
  },
  products: {
    fontSize: 16, 
    color: "#6A994E",
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    color: "#6A994E",
    fontWeight: "bold",
    marginBottom: 10,
  },
  deliveryDate: {
    fontSize: 16, 
    color: "#6A994E",
    marginBottom: 10, 
  },
  paymentStatus: {
    fontSize: 16, 
    color: "#6A994E",
    marginBottom: 10, 
  },
  
  statusBadge: (status) => ({
    backgroundColor: status === "Delivered" ? "#28A745" : "#FFC107",
    color: "#FFF",
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 16, 
  }),
  paymentHistoryItem: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#6A994E",
    borderRadius: 10,
    padding: 20, 
    marginBottom: 15,
    elevation: 3,
  },
  paymentTextBold: {
    fontSize: 18, 
    fontWeight: "bold",
    color: "#6A994E",
  },
  paymentText: {
    fontSize: 16, 
    color: "#6A994E",
  },
  amountText: {
    fontSize: 18, 
    color: "#6A994E",
    fontWeight: "bold",
  },
  paidStatus: {
    fontSize: 18, 
    color: "#28A745",
    fontWeight: "bold",
  },
  noOrdersText: {
    fontSize: 18, 
    color: "#6A994E",
    textAlign: "center",
    marginTop: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#6A994E",
    marginVertical: 15,
  },
});

export default OrderList;

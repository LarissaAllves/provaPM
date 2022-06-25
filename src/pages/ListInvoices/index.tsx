import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet, FlatList, Alert, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { ListCard } from "../../components/ListCard";

interface IListInvoices {
  id: string;
  invoice: string;
  client: string;
  invoice_value: number;
}
interface IListInvoicesProps {
  id: string;
  invoice: string;
  client: string;
  invoice_value: number;
  pis: number;
  cofins: number;
  csll: number;
  iss: number;
  liquid: number;
}

export function ListInvoices() {
  const [status, setStatus] = useState("");
  const [invoiceData, setInvoiceData] = useState<IListInvoicesProps[]>([]);

  let invoicesAll: IListInvoicesProps[] = [];

  let invoices: IListInvoices[] = [];

  function handleDeleteInvoice(id: string) {
    Alert.alert("Exclusão", "Tem certeza?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          setStatus("E");
          setInvoiceData((invoiceData) =>
            invoiceData.filter((inv) => inv.id !== id)
          );
        },
      },
    ]);
  }

  async function loadDataInvoice() {
    const data = await AsyncStorage.getItem("@si:invoice");
    if (data) {
      console.log("data", data);
      invoices = JSON.parse(data);
      invoicesAll = invoices.map((invoice) => {
        const data = {
          id: invoice.id,
          invoice: invoice.invoice,
          client: invoice.client,
          invoice_value: invoice.invoice_value,
          pis: calculoValorPis(invoice.invoice_value),
          cofins: calculoCofins(invoice.invoice_value),
          csll: calculoCsll(invoice.invoice_value),
          iss: calculoIss(invoice.invoice_value),
          liquid: calculoLiquid(invoice.invoice_value),
        };
        return data;
      });
      setInvoiceData(invoicesAll);
    }
  }

  function totalValorNotas() {
    return parseFloat(
      invoiceData
        .reduce((total, invoice) => (total += invoice.invoice_value), 0)
        .toFixed(2)
    );
  }

  function totalPis() {
    return invoiceData.reduce((total, invoice) => (total += invoice.pis), 0);
  }

  function totalCofins() {
    return invoiceData.reduce((total, invoice) => (total += invoice.cofins), 0);
  }

  function totalCsll() {
    return invoiceData.reduce((total, invoice) => (total += invoice.csll), 0);
  }
  function totalIss() {
    return invoiceData.reduce((total, invoice) => (total += invoice.iss), 0);
  }

  function totalLiquid() {
    return invoiceData.reduce((total, invoice) => (total += invoice.liquid), 0);
  }

  function calculoLiquid(invoice_value: number) {
    return parseFloat(
      (
        invoice_value -
        calculoValorPis(invoice_value) -
        calculoCofins(invoice_value) -
        calculoIss(invoice_value)
      ).toFixed(2)
    );
  }

  function calculoValorPis(invoice_value: number) {
    return parseFloat(((invoice_value * 0.65) / 100).toFixed(2));
  }

  function calculoCofins(invoice_value: number) {
    return parseFloat((invoice_value * 0.03).toFixed(2));
  }

  function calculoCsll(invoice_value: number) {
    return parseFloat((invoice_value * 0.01).toFixed(2));
  }

  function calculoIss(invoice_value: number) {
    return parseFloat((invoice_value * 0.04).toFixed(2));
  }

  useEffect(() => {
    loadDataInvoice();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDataInvoice();
    }, [])
  );

  useEffect(() => {
    async function saveInvoices() {
      await AsyncStorage.setItem("@si:invoice", JSON.stringify(invoiceData));
    }
    saveInvoices();
  }, [invoiceData]);

  return (
    <View style={styles.container}>
      <Header title="Listam de NF Serviço" />

      <View style={styles.content}>
        <Text style={styles.textCard}>
          Total do valor da NF:{totalValorNotas()}{" "}
        </Text>
        <Text style={styles.textCard}>Total do valor do Pis:{totalPis()} </Text>
        <Text style={styles.textCard}>
          Total do valor do Cofins: {totalCofins()}
        </Text>
        <Text style={styles.textCard}>
          Total do valor do Csll:{totalCsll()}
        </Text>
        <Text style={styles.textCard}>Total do valor do Iss:{totalIss()} </Text>
        <Text style={styles.textCard}>
          Total do valor líquido da NF:{totalLiquid()}
        </Text>
      </View>

      <FlatList
        data={invoiceData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListCard item={item} onPress={() => handleDeleteInvoice(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f0f2f5",
  },
  content: {
    marginTop: 5,
    marginLeft: 5,
    padding: 6,
  },
  textCard: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    flexDirection: "row",
    marginBottom: 4,
  },
});

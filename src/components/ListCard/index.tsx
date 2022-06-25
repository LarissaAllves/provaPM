import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

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

interface ListCardProps extends TouchableOpacityProps {
  item: IListInvoicesProps;
}
export function ListCard({ item, ...rest }: ListCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonCard} key={item.id} {...rest}>
        <View style={styles.separator} />
        {console.log("item:", item)}

        <Text style={styles.titleCard}>Dados da NF</Text>
        <Text style={styles.textCard}>Nota Fiscal:{item.invoice} </Text>
        <Text style={styles.textCard}>Cliente: {item.client}</Text>
        <Text style={styles.textCard}>Valor da NF: {item.invoice_value} </Text>
        <Text style={styles.textCard}>Valor do Pis:{item.pis} </Text>
        <Text style={styles.textCard}>Valor do Cofins: {item.cofins}</Text>
        <Text style={styles.textCard}>Valor do Csll: {item.csll} </Text>
        <Text style={styles.textCard}>Valor do Iss: {item.iss}</Text>
        <Text style={styles.textCard}>Valor Liquido da NF: {item.liquid}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
  },
  buttonCard: {
    width: "100%",
    padding: 6,
    backgroundColor: "#969CB2",
    borderRadius: 10,
  },
  textCard: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    flexDirection: "row",
  },
  titleCard: {
    color: "#ff872c",
    fontSize: 26,
    fontWeight: "bold",
    flexDirection: "row",
  },
  separator: {
    marginTop: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});

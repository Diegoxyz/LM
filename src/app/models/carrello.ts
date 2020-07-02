/*
    <Key>
          <PropertyRef Name="Email"/>
          <PropertyRef Name="Matnr"/>
        </Key>
    <Property Name="Email" Type="Edm.String" Nullable="false" MaxLength="241" sap:unicode="false" sap:label="E-Mail Address" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
    <Property Name="Token" Type="Edm.String" Nullable="false" MaxLength="32" sap:unicode="false" sap:label="Character field, length 32" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
    <Property Name="Matnr" Type="Edm.String" Nullable="false" MaxLength="18" sap:unicode="false" sap:label="Material" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
    <Property Name="Maktx" Type="Edm.String" Nullable="false" MaxLength="40" sap:unicode="false" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
    <Property Name="Menge" Type="Edm.Decimal" Nullable="false" Precision="13" Scale="3" sap:unicode="false" sap:unit="Meins" sap:label="Quantity" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
    <Property Name="Meins" Type="Edm.String" Nullable="false" MaxLength="3" sap:unicode="false" sap:label="Base Unit" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false" sap:semantics="unit-of-measure"/>
*/
export class Carrello {

    Email: string;
    Token: string;
    Matnr: string;
    Maktx: string;
    Menge: string;
    Meins: string;

}
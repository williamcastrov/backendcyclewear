import React, { Fragment, useEffect, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Breadcrumb from "../common/breadcrumb";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CancelIcon from "@material-ui/icons/Cancel";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import Moment from "moment";
import swal from "sweetalert";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "reactstrap";
//import Loading from "../../../components/elements/Loading";
import EditIcon from "@material-ui/icons/Edit";
import imagen1 from "../../assets/images/imagenes/bicicleta.jpg";
import Loading from "../elements/Loading/Loading";
import ListarProductos from "../products/physical/ListarProductos";

function CreateInvoice(props) {
  const [lisPedidos, setListPedidos] = useState([]);
  const [lisProductosSiigo, setListProductosSiigo] = useState([]);
  const [listIdentificacion, setListIdentificacion] = useState([]);
  const [listDetalleFacturas, setListDetalleFacturas] = useState([]);
  const [pagina, setPagina] = useState(false);
  const [tipoTercero, setTipoTercero] = useState("");
  const [loading, setLoading] = useState(false);
  const fechaactual = Moment(new Date()).format("YYYY-MM-DD");
  //const fechaactual = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const [datosClientesFacturas, setDatosClientesFacturas] = useState([]);
  const [datos, setDatos] = useState([]);
  const dispatch = useDispatch();
  const [leeFacturas, setLeeFacturas] = useState(false);
  const [leePedidos, setLeePedidos] = useState(false);
  const [actualizaBD, setActualizaBD] = useState(false);
  const [validarDatos, setValidarDatos] = useState(false);
  const [contraSiigo, setContraSiigo] = useState(false);

  const [datapedidos, setDatapedidos] = useState([]);
  const [dataitemspedidos, setDataitemspedidos] = useState([]);
  const [dataproductos, setDataproductos] = useState([]);

  //console.log("IMAGEN : ", imagen1)

  useEffect(() => {
    if (leePedidos) {
      const newDet = [];
      setLeePedidos(false);
      let contador = 94;
      let contadordos = 0;

      const consultaFacturas = async () => {
        setLoading(true);
        for (var i = 89; i < 96; i++) {
          const params = {
            pagina: i,
          };
          if (i == 95) {
            //setLoading(false);
            setLeeFacturas(true);
            break;
          }
          contadordos = i;
          //console.log("FECHA ", params);
          await axios({
            method: "post",
            url: "https://sitbusiness.co/cyclewear/api/201",
            params,
          })
            .then((res) => {
              console.log("DATOS RETORNA : ", res.data.data);
              //return;

              res.data.data &&
                res.data.data.map((row, index) => {
                  //console.log("ID FACTURAS LEIDAS : ", row);
                  let date = new Date(row.attributes.created_at);
                  let fecha = String(
                    date.getFullYear() +
                      "-" +
                      String(date.getMonth() + 1).padStart(2, "0") +
                      "-" +
                      date.getDate()
                  ).padStart(2, "0");
                  //console.log("FECHA : ", fecha);
                  let item = {
                    id_fact: row.id,
                    id_siigo: 0,
                    comprobante: 0,
                    prefijo: 0,
                    facturasiigo: 0,
                    fechafactura: fecha,
                    idcliente: 0,
                    valorfactura: row.attributes.subtotal,
                    descuento: row.attributes.discount,
                    cost_center: 235,
                    seller: row.attributes.seller_id,
                    valorimpuesto: row.attributes.tax_total,
                    porcentajeimpto: 0,
                    Observaciones: "",
                  };

                  newDet.push(item);
                });

              setListPedidos(newDet);

              newDet &&
                newDet.map((params, index) => {
                  //console.log("PEDIDOS LEIDOS : ", params);

                  const grabarpedidos = async () => {
                    await axios({
                      method: "post",
                      url: "https://sitbusiness.co/cyclewear/api/206",
                      params,
                    })
                      .then((res) => {
                        //console.log("VALOR CONTADOR DOS : ", contadordos);
                        //setListIdentificacion(newDetId[0]);
                      })
                      .catch(function (error) {
                        console.log("ERROR LEYENDO FACTURAS");
                      });
                  };
                  grabarpedidos();
                });
            })
            .catch(function (error) {
              console.log("ERROR LEYENDO FACTURAS");
            });
        }
      };
      consultaFacturas();
    }
  }, [leePedidos]);

  useEffect(() => {
    if (leeFacturas) {
      //console.log("NUMERO DE PEDIDOS : ", lisPedidos.length);
      //console.log("PEDIDOS : ", lisPedidos);
      setLoading(true);
      const newDetPed = [];

      let control = 0;
      let numeropedidos = lisPedidos.length;

      lisPedidos &&
        lisPedidos.map((facturas, index) => {
          const leer = async () => {
            const params = {
              factura: facturas.id_fact,
            };
            //console.log("LISTADO PEDIDOS : ", params)

            await axios({
              method: "get",
              url: "https://sitbusiness.co/cyclewear/api/202",
              params,
            })
              .then((res) => {
                let tama??o = res.data.included.length;
                let posicion = tama??o - 1;
                let direccion = res.data.included[posicion].attributes.address;
                //console.log("DETALLE PEDIDOD : ", res.data.included[posicion].attributes.address, "TAMA??O : ", tama??o);
                //return
                res.data.included &&
                  res.data.included.map((itempedido, index) => {
                    //console.log("ITEM PEDIDOS : ", itempedido);
                    let codigoproducto;
                    /*
                            lisProductosSiigo && lisProductosSiigo.forEach((producto) => {
                                if (itempedido.attributes.variant_sku === producto.sku) {
                                    codigoproducto = producto.codigo;
                                }
                            })
                            */

                    //console.log("TIPO PEDIDOD : ", itempedido.type);

                    if (itempedido.type == "line_items") {
                      //console.log("GRABANDO PEDIDOD : ", params);
                      let item = {
                        itempedido: itempedido.id,
                        pedido: itempedido.attributes.invoice_id,
                        advert_name: itempedido.attributes.advert_name,
                        advert_code: itempedido.attributes.advert_code,
                        brand_name: itempedido.attributes.brand_name,
                        price: itempedido.attributes.price,
                        quantity: itempedido.attributes.quantity,
                        subtotal: itempedido.attributes.subtotal,
                        tax_total: itempedido.attributes.tax_total,
                        taxon_name: itempedido.attributes.taxon_name,
                        total: itempedido.attributes.total,
                        variant_barcode: itempedido.attributes.variant_barcode,
                        variant_name: itempedido.attributes.variant_name,
                        variant_sku: itempedido.attributes.variant_sku,
                        codigoproductosiigo: 0, //codigoproducto,
                        direccion: direccion,
                        observaciones: "",
                      };
                      //console.log("ITEM PEDIDO : ", item)
                      newDetPed.push(item);
                    }
                  });
              })
              .catch(function (error) {
                console.log("ERROR LEYENDO FACTURAS");
              });

            control = control + 1;
            //console.log("VALOR CONTROL : ", control);
            if (control === numeropedidos) {
              console.log("LOADING EN FALSE");
              setLoading(false);
              actualizarDatosBD();
            }
          };
          leer();
        });

      setListDetalleFacturas(newDetPed);
      setLeeFacturas(false);
    }
  }, [leeFacturas]);

  const readPedidos = () => {
    setLeePedidos(true);
    //setLeeFacturas(true);
  };

  useEffect(() => {
    //setLoading(true);
    //console.log("TERCEROS CREADOS : ", listaTercerosCreados);
    //console.log("FACTURAS LEIDAS : ", datosClientesFacturas);

    //console.log("ENCABEZADO PEDIDOS : ", lisPedidos);
    console.log("DETALLE PEDIDOS : ", listDetalleFacturas);

    let longitud = lisPedidos.length;
    let contador = 0;

    contador = 0;
    longitud = listDetalleFacturas.length;
    console.log("NUMERO ITEMS PEDIDOS : ", longitud);

    listDetalleFacturas &&
      listDetalleFacturas.forEach((row) => {
        const leerItems = async () => {
          //let anno = row.fechafactura.getFullYear();
          //let mes = row.fechafactura.getMonth();
          //let dia = row.fechafactura. getDate();
          //console.log("VALOR FECHA : ", Moment.format("YYYY/MM/DD", row.fechafactura));

          const params = {
            itempedido: row.itempedido,
            pedido: row.pedido,
            advert_name: row.advert_name,
            advert_code: row.advert_code,
            brand_name: row.brand_name,
            proce: row.price,
            quantity: row.quantity,
            subtotal: row.subtotal,
            tax_total: row.tax_total,
            taxon_name: row.taxon_name,
            total: row.total,
            variant_barcode: row.variant_barcode,
            variant_name: row.variant_name,
            variant_sku: row.variant_sku,
            codigoproductosiigo: row.codigoproductosiigo,
            direccion: row.direccion,
            observaciones: "Items pedido # " + row.pedido,
          };
          await axios({
            method: "post",
            url: "https://sitbusiness.co/cyclewear/api/207",
            params,
          })
            .then((res) => {
              contador = contador + 1;
              if (contador === longitud) {
                console.log("VALOR RESPONSE : ", res);
                leerProductoSiigo(true);
                setLoading(false);
              }
            })
            .catch(function (error) {
              console.log("ERROR LEYENDO FACTURAS");
            });
        };
        leerItems();
      });
  }, [actualizaBD]);

  //const leerDatosFacturas = async () => {
  const actualizarDatosBD = () => {
    setActualizaBD(true);
  };

  const handleChangePagina = async (selectedOptions) => {
    setPagina(selectedOptions);
  };

  const leerProductoSiigo = async () => {
    setLoading(true);
    const newDetPed = [];

    const leeProductosSiigo = async () => {
      for (var i = 1; i < 12; i++) {
        const params = {
          pagina: i,
        };

        if (i == 10) {
          setLoading(false);
          setListProductosSiigo(newDetPed);
          setValidarDatos(true);
          break;
        }

        await axios({
          method: "post",
          url: "https://sitbusiness.co/cyclewear/api/715",
          params,
        })
          .then((res) => {
            console.log("PAGINA : ", params);
            res.data &&
              res.data.map((row, index) => {
                //console.log("ID FACTURAS LEIDAS : ", row);
                let item = {
                  code: row.code,
                  id: row.id,
                  name: row.name,
                  sku: row.sku,
                  cantidad: row.cantidad,
                  impuestos: row.impuestos,
                };
                newDetPed.push(item);
              });
            //setLeeFacturas(true);
          })
          .catch(function (error) {
            console.log("ERROR LEYENDO FACTURAS");
          });
      }
    };
    leeProductosSiigo();
  };

  useEffect(() => {
    if (validarDatos) {
      setLoading(true);

      const productos = async () => {
        await axios({
          method: "post",
          url: "https://sitbusiness.co/cyclewear/api/27",
        })
          .then((res) => {
            //console.log("Productos : ", res.data);
            setDataproductos(res.data);
          })
          .catch(function (error) {
            console.log("ERROR LEYENDO PRODUCTOS");
          });
      };
      productos();

      const pedidos = async () => {
        await axios({
          method: "post",
          url: "https://sitbusiness.co/cyclewear/api/210",
        })
          .then((res) => {
            setDatapedidos(res.data);
          })
          .catch(function (error) {
            console.log("ERROR LEYENDO PEDIDOS");
          });
      };
      pedidos();

      const itemspedidos = async () => {
        await axios({
          method: "post",
          url: "https://sitbusiness.co/cyclewear/api/211",
        })
          .then((res) => {
            setDataitemspedidos(res.data);
            //validaContraSiigo();
            setLoading(false);
          })
          .catch(function (error) {
            console.log("ERROR LEYENDO PEDIDOS");
          });
      };
      itemspedidos();

      //console.log("Items pedidos : ", dbitemspedidos);
      //console.log("Productos : ", dbproductos);
      //console.log("Pedidos : ", dbpedidos);
      setValidarDatos(false);
    }
  }, [validarDatos]);

  useEffect(() => {
    if (contraSiigo) {
      console.log("Items pedidos : ", dataitemspedidos);
      console.log("Productos : ", dataproductos);
      console.log("Pedidos : ", datapedidos);
      setLoading(true);

      const newItemPed = [];
      dataitemspedidos &&
        dataitemspedidos.map((items, index) => {
          let row = {
            pedido: items.pedido,
            itempedido: items.itempedido,
            sku: items.variant_sku,
          };
          newItemPed.push(row);
        });

      const newProd = [];
      dataproductos &&
        dataproductos.map((items, index) => {
          newProd.push(items.sku);
        });

      //console.log("Items pedidos : ", newItemPed);
      //console.log("Productos : ", newProd);

      const newItems = [];
      let valida;
      newItemPed &&
        newItemPed.map((items, index) => {
          valida = newProd.includes(items.sku);
          if (!valida) {
            newItems.push(items);
          }
        });

      console.log("NEW ITEMS : ", newItems);
      let cantidad = newItems.length;
      let contar = 0;

      newItems &&
        newItems.map((items, index) => {
          console.log("ITEMS PEDIDOS : ", items);
          const actualiza = async () => {
            const params = {
              estado: 0,
              itempedido: items.itempedido,
            };
            await axios({
              method: "post",
              url: "https://sitbusiness.co/cyclewear/api/717",
              params,
            })
              .then((res) => {
                console.log("Actualizando");
                contar = contar + 1;
                if (cantidad == contar) {
                  leeIdentificacion();
                }

                setLoading(false);
              })
              .catch(function (error) {
                contar = contar + 1;
                if (cantidad == contar) {
                  leeIdentificacion();
                }
                console.log("ERROR Actualizando");
              });
          };
          actualiza();
        });
      setContraSiigo(false);
    }
  }, [contraSiigo]);

  const validaContraSiigo = async () => {
    setContraSiigo(true);
  };

  const leeIdentificacion = async () => {
    setLoading(true);

    let contador = datapedidos.length;
    //console.log("NUMERO PEDIDOS : ", contador);
    
    let contadordos = 0;

    const newItems = [];

    datapedidos &&
      datapedidos.map((pedido, index) => {
        const identificacion = async () => {
          const params = {
            factura: pedido.id_fact,
          };

          await axios({
            method: "post",
            url: "https://sitbusiness.co/cyclewear/api/709",
            params,
          })
            .then((res) => {
              contadordos = contadordos + 1;
              console.log("Contador : ", contadordos);

              let items = {
                pedido: pedido.id_fact,
                cedula: res.data.DocumentID,
              };
              newItems.push(items);
              
              if (contadordos == contador) {
                let long = newItems.length;
                let cont = 0;

                newItems.map((items, index) => {
                    console.log("INFORMACION PEDIDOS : ", items);
                    const actualizaId = async () => {
                      const params = {
                        cedula: items.cedula,
                        pedido: items.pedido,
                      };

                      await axios({
                        method: "post",
                        url: "https://sitbusiness.co/cyclewear/api/212",
                        params,
                      })
                        .then((res) => {
                          cont = cont + 1;
                          console.log("Actualizando Pedido : ", items.pedido);

                          if (cont == long) {
                            setLoading(false);
                          }
                        })
                        .catch(function (error) {
                            cont = cont + 1;
                            if (cont == long) {
                                setLoading(false);
                          }
                          console.log("ERROR Actualizando");
                        });
                    };
                    actualizaId();
                  });
              }
            })
            .catch(function (error) {
              contadordos = contadordos + 1;
              console.log("ERROR Actualizando");
            });
        };
        identificacion();
      });
  };

  return (
    <div>
      {loading ? <Loading /> : null}
      <br />
      <div className="mb-30 ml-10">
        <Row>
          <Col xl={3} lg={3} md={3} xs={3}>
            <div className="tama??ofuentetercero">Pagina inicial:</div>
          </Col>
          <Col xl={3} lg={3} md={3} xs={3} className="mlmenos50 mtmenos5">
            <div className="form-horizontal auth-form">
              <div>
                <input
                  name="pagina"
                  type="numeric"
                  className="form-control"
                  placeholder="Ingres?? p??gina inicial"
                  id="exampleInputEmail12"
                  onChange={(e) => handleChangePagina(e.target.value)}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <hr />
      <Row>
        <Col xl={3} lg={3} md={3} xs={3}>
          <button className="botoncrearcliente" color="primary">
            <ReactHTMLTableToExcel
              table="ubicacionesequipos"
              filename="DatosClientesCWR"
              sheet="Sheet"
              buttonText="Exportar a Excel"
            />
          </button>
        </Col>
        <Col xl={3} lg={3} md={3} xs={3}>
          <button
            className="botoncrearcliente"
            color="primary"
            onClick={readPedidos}
          >
            Lee Pedidos BE
          </button>
        </Col>
        <Col xl={3} lg={3} md={3} xs={3}>
          <button
            className="botoncrearcliente"
            color="primary"
            onClick={validaContraSiigo}
          >
            Validar Datos
          </button>
        </Col>
      </Row>
      <hr />
      {
        <table id="ubicacionesequipos" className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Id</th>
              <th>Sku</th>
              <th>Name</th>
              <th>Cantidad</th>
              <th>Impuestos</th>
            </tr>
          </thead>
          <tbody>
            {lisProductosSiigo &&
              lisProductosSiigo.map((facturas, index) => {
                return (
                  <tr>
                    <td>{facturas.code}</td>
                    <td>{facturas.id}</td>
                    <td>{facturas.sku}</td>
                    <td>{facturas.name}</td>
                    <td>{facturas.cantidad}</td>
                    <td>{facturas.impuestos}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      }
    </div>
  );
}

export default CreateInvoice;

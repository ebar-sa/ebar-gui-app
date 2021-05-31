import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';

import MenuBookIcon from '@material-ui/icons/MenuBook';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Footer from "../../components/Footer";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    upperDiv: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'justify',
        color: theme.palette.text.secondary,
        height: '520px',
        overflow: 'auto',
        marginBottom: '40px'
    },
    centered: {
        textAlign: 'center',
    }
}));

export default function ServiceTerms() {
    const classes = useStyles();

    return (
        <div>
            <Container component="main">
                <CssBaseline/>
                <div className={classes.upperDiv}>
                    <Avatar className={classes.avatar}>
                        <MenuBookIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Términos y condiciones de uso
                    </Typography>
                </div>
                <br/>
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={3} className={classes.paper}>
                                <Typography variant="h5" component="h2" gutterBottom className={classes.centered}>
                                    <b>AVISO LEGAL Y CONDICIONES GENERALES DE USO DEL SITIO WEB</b>
                                </Typography>
                                <Typography variant="h6" component="h2" gutterBottom className={classes.centered}>
                                    https://ebarapp.es
                                </Typography>
                                <Typography component="h2" gutterBottom>
                                    <b>I. INFORMACIÓN GENERAL</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios
                                    de
                                    la Sociedad de la Información y el Comercio Electrónico (LSSI-CE) de 11 de julio, se
                                    facilitan a continuación los siguientes datos de información general de este sitio
                                    web:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    La titularidad de este sitio web, https://ebarapp.es, (en
                                    adelante,
                                    Sitio Web) la ostenta: EBAR S.L., provista de NIF: A-8008000 e inscrita en el
                                    Registro
                                    Mercantil de Sevilla con los siguientes datos registrales: Tomo 0, Hoja 99, Folio
                                    888,
                                    cuyo representante es: Álvaro Ezequiel Martos Suero, y cuyos datos de contacto son:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Dirección: Av. Reina Mercedes S/N
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Teléfono de contacto: 611 111 111
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Email de contacto: ebar.app.info@gmail.com
                                </Typography>
                                <Typography component="h2" gutterBottom>
                                    <b>II. TÉRMINOS Y CONDICIONES GENERALES DE USO</b>
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>El objeto de las condiciones: El Sitio Web</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El objeto de las presentes Condiciones Generales de Uso (en adelante, Condiciones)
                                    es
                                    regular el acceso y la utilización del Sitio Web. A los efectos de las presentes
                                    Condiciones se entenderá como Sitio Web: la apariencia externa de los interfaces de
                                    pantalla, tanto de forma estática como de forma dinámica, es decir, el árbol de
                                    navegación; y todos los elementos integrados tanto en los interfaces de pantalla
                                    como en
                                    el árbol de navegación (en adelante, Contenidos) y todos aquellos servicios o
                                    recursos
                                    en línea que en su caso ofrezca a los Usuarios (en adelante, Servicios).
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar se reserva la facultad de modificar, en cualquier momento, y sin aviso previo,
                                    la
                                    presentación y configuración del Sitio Web y de los Contenidos y Servicios que en él
                                    pudieran estar incorporados. El Usuario reconoce y acepta que en cualquier momento
                                    eBar
                                    pueda interrumpir, desactivar y/o cancelar cualquiera de estos elementos que se
                                    integran
                                    en el Sitio Web o el acceso a los mismos.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Aparte del coste de conexión a través de la red de telecomunicaciones suministrada
                                    por
                                    el proveedor de acceso, y que hubiere contratado el Usuario, algunos de los
                                    Contenidos o
                                    Servicios ofrecidos por eBar o, en su caso, terceros a través del Sitio Web pueden
                                    encontrarse sujetos a la contratación previa del Contenido o Servicio, en cuyo caso
                                    se
                                    especificará de forma clara y/o se pondrá a disposición del Usuario las
                                    correspondientes
                                    Condiciones Generales o Particulares por las que esto se rija.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    La utilización de alguno de los Contenidos o Servicios del Sitio Web podrá hacerse
                                    mediante la suscripción o registro previo del Usuario.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>El Usuario</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El acceso, la navegación y uso del Sitio Web, confiere la condición de Usuario, por
                                    lo
                                    que se aceptan, desde que se inicia la navegación por el Sitio Web, todas las
                                    Condiciones aquí establecidas, así como sus ulteriores modificaciones, sin perjuicio
                                    de
                                    la aplicación de la correspondiente normativa legal de obligado cumplimiento según
                                    el
                                    caso. Dada la relevancia de lo anterior, se recomienda al Usuario leerlas cada vez
                                    que
                                    visite el Sitio Web.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Sitio Web de eBar proporciona gran diversidad de información, servicios y datos.
                                    El
                                    Usuario asume su responsabilidad para realizar un uso correcto del Sitio Web. Esta
                                    responsabilidad se extenderá a:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        Un uso de la información, Contenidos y/o Servicios y datos ofrecidos por eBar
                                        sin
                                        que sea contrario a lo dispuesto por las presentes Condiciones, la Ley, la moral
                                        o
                                        el orden público, o que de cualquier otro modo puedan suponer lesión de los
                                        derechos
                                        de terceros o del mismo funcionamiento del Sitio Web.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        La veracidad y licitud de las informaciones aportadas por el Usuario en los
                                        formularios extendidos por eBar para el acceso a ciertos Contenidos o Servicios
                                        ofrecidos por el Sitio Web. En todo caso, el Usuario notificará de forma
                                        inmediata a
                                        eBar acerca de cualquier hecho que permita el uso indebido de la información
                                        registrada en dichos formularios, tales como, pero no sólo, el robo, extravío, o
                                        el
                                        acceso no autorizado a identificadores y/o contraseñas, con el fin de proceder a
                                        su
                                        inmediata cancelación.
                                    </Typography></li>
                                </ul>
                                <Typography variant="body1" gutterBottom>
                                    El mero acceso a este Sitio Web no supone entablar ningún tipo de relación de
                                    carácter
                                    comercial entre eBar y el Usuario.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Siempre en el respeto de la legislación vigente, este Sitio Web de eBar se dirige a
                                    todas las personas, sin importar su edad, que puedan acceder y/o navegar por las
                                    páginas
                                    del Sitio Web.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Sitio Web está dirigido principalmente a Usuarios residentes en España. eBar no
                                    asegura que el Sitio Web cumpla con legislaciones de otros países, ya sea total o
                                    parcialmente. Si el Usuario reside o tiene su domiciliado en otro lugar y decide
                                    acceder
                                    y/o navegar en el Sitio Web lo hará bajo su propia responsabilidad, deberá
                                    asegurarse de
                                    que tal acceso y navegación cumple con la legislación local que le es aplicable, no
                                    asumiendo eBar responsabilidad alguna que se pueda derivar de dicho
                                    acceso.
                                </Typography>
                                <Typography component="h2" gutterBottom>
                                    <b>III. ACCESO Y NAVEGACIÓN EN EL SITIO WEB: EXCLUSIÓN DE GARANTÍAS Y
                                        RESPONSABILIDAD</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar no garantiza la continuidad, disponibilidad y utilidad del Sitio Web, ni de los
                                    Contenidos o Servicios. eBar hará todo lo posible por el buen funcionamiento del
                                    Sitio
                                    Web, sin embargo, no se responsabiliza ni garantiza que el acceso a este Sitio Web
                                    no
                                    vaya a ser ininterrumpido o que esté libre de error.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar tampoco se hace responsable de los daños que pudiesen ocasionarse a los
                                    usuarios
                                    por un uso inadecuado de este Sitio Web. En particular, no se hace responsable en
                                    modo
                                    alguno de las caídas, interrupciones, falta o defecto de las telecomunicaciones que
                                    pudieran ocurrir.
                                </Typography>
                                <Typography component="h2" gutterBottom>
                                    <b>IV. POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Por la presente, eBar se compromete a adoptar las medidas técnicas y organizativas
                                    necesarias, según el nivel de seguridad adecuado al riesgo de los datos recogidos.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Leyes que incorpora esta política de privacidad</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Esta política de privacidad está adaptada a la normativa española y europea vigente
                                    en
                                    materia de protección de datos personales en internet. En concreto, la misma respeta
                                    las
                                    siguientes normas:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        El Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril
                                        de 2016, relativo a la protección de las personas físicas en lo que respecta al
                                        tratamiento de datos personales y a la libre circulación de estos datos (RGPD).
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        La Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y
                                        garantía de los derechos digitales (LOPD-GDD).
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        El Real Decreto 1720/2007, de 21 de diciembre, por el que se aprueba el
                                        Reglamento
                                        de desarrollo de la Ley Orgánica 15/1999, de 13 de diciembre, de Protección de
                                        Datos
                                        de Carácter Personal (RDLOPD).
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        La Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y
                                        de
                                        Comercio Electrónico (LSSI-CE).
                                    </Typography></li>
                                </ul>
                                <Typography component="h3" gutterBottom>
                                    <b>Identidad del responsable del tratamiento de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El responsable del tratamiento de los datos personales recogidos en eBar es: Álvaro
                                    Ezequiel Martos Suero, con NIF: 11111111-A (en adelante, también Responsable del
                                    tratamiento). Sus datos de contacto son los siguientes:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Dirección: Av. Reina Mercedes S/N
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Teléfono de contacto: 611 111 111
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Email de contacto: ebar.app.info@gmail.com
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Delegado de Protección de Datos (DPD)</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Delegado de Protección de Datos (DPD, o DPO por sus siglas en inglés) es el
                                    encargado
                                    de velar por el cumplimiento de la normativa de protección de datos a la cual se
                                    encuentra sujeta eBar. El Usuario puede contactar con el DPD designado por el
                                    Responsable del tratamiento utilizando los siguientes datos de contacto:
                                    ebar.app.info@gmail.com.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Registro de Datos de Carácter Personal</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En cumplimiento de lo establecido en el RGPD y la LOPD-GDD, le informamos que los
                                    datos
                                    personales recabados por eBar mediante los formularios extendidos en sus páginas
                                    quedarán incorporados y serán tratados en nuestros ficheros con el fin de poder
                                    facilitar, agilizar y cumplir los compromisos establecidos entre eBar y el Usuario o
                                    el
                                    mantenimiento de la relación que se establezca en los formularios que este rellene,
                                    o
                                    para atender una solicitud o consulta de este. Asimismo, de conformidad con lo
                                    previsto
                                    en el RGPD y la LOPD-GDD, salvo que sea de aplicación la excepción prevista en el
                                    artículo 30.5 del RGPD, se mantiene un registro de actividades de tratamiento que
                                    especifica, según sus finalidades, las actividades de tratamiento llevadas a cabo y
                                    las
                                    demás circunstancias establecidas en el RGPD.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Principios aplicables al tratamiento de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El tratamiento de los datos personales del Usuario se someterá a los siguientes
                                    principios recogidos en el artículo 5 del RGPD:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de licitud, lealtad y transparencia: se requerirá en todo momento el
                                        consentimiento del Usuario previa información completamente transparente de los
                                        fines para los cuales se recogen los datos personales.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de limitación de la finalidad: los datos personales serán recogidos
                                        con
                                        fines determinados, explícitos y legítimos.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de minimización de datos: los datos personales recogidos serán
                                        únicamente
                                        los estrictamente necesarios en relación con los fines para los que son
                                        tratados.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de exactitud: los datos personales deben ser exactos y estar siempre
                                        actualizados.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de limitación del plazo de conservación: los datos personales solo
                                        serán
                                        mantenidos de forma que se permita la identificación del Usuario durante el
                                        tiempo
                                        necesario para los fines de su tratamiento.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de integridad y confidencialidad: los datos personales serán tratados
                                        de
                                        manera que se garantice su seguridad y confidencialidad.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Principio de responsabilidad proactiva: el Responsable del tratamiento será
                                        responsable de asegurar que los principios anteriores se cumplen.
                                    </Typography></li>
                                </ul>
                                <Typography component="h3" gutterBottom>
                                    <b>Categorías de datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Las categorías de datos que se tratan en eBar son únicamente datos identificativos.
                                    En
                                    ningún caso, se tratan categorías especiales de datos personales en el sentido del
                                    artículo 9 del RGPD.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Base legal para el tratamiento de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    La base legal para el tratamiento de los datos personales es el consentimiento. eBar
                                    se
                                    compromete a recabar el consentimiento expreso y verificable del Usuario para el
                                    tratamiento de sus datos personales para uno o varios fines específicos.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Usuario tendrá derecho a retirar su consentimiento en cualquier momento. Será tan
                                    fácil retirar el consentimiento como darlo. Como regla general, la retirada del
                                    consentimiento no condicionará el uso del Sitio Web.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En las ocasiones en las que el Usuario deba o pueda facilitar sus datos a través de
                                    formularios para realizar consultas, solicitar información o por motivos
                                    relacionados
                                    con el contenido del Sitio Web, se le informará en caso de que la cumplimentación de
                                    alguno de ellos sea obligatoria debido a que los mismos sean imprescindibles para el
                                    correcto desarrollo de la operación realizada.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Fines del tratamiento a que se destinan los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Los datos personales son recabados y gestionados por eBar con la finalidad de poder
                                    facilitar, agilizar y cumplir los compromisos establecidos entre el Sitio Web y el
                                    Usuario o el mantenimiento de la relación que se establezca en los formularios que
                                    este último rellene o para atender una solicitud o consulta.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En el momento en que se obtengan los datos personales, se informará al Usuario
                                    acerca del fin o fines específicos del tratamiento a que se destinarán los datos
                                    personales; es decir, del uso o usos que se dará a la información recopilada.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    A continuación, se detallan los datos personales que se requieren de los Usuarios y
                                    los fines a los que se destinan y por los cuales son recabados:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        Nombre de usuario: el nombre de usuario actuará como identificación inequívoca
                                        de cada usuario en el Sitio Web, por lo que deberá ser único y de obligatoria
                                        cumplimentación.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Nombre: el nombre del titular de la cuenta se usará para su identificación
                                        personal, por lo que es de obligatoria cumplimentación.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Apellido: el apellido o apellidos del titular de la cuenta se usará para su
                                        identificación personal, por lo que es de obligatoria cumplimentación.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Dirección de correo electrónico: la dirección de correo electrónico personal del
                                        titular de la cuenta se usará para, en el caso que sea requerido, ponerse en
                                        contacto con la persona registrada con el fin de informarle de aspectos de
                                        seguridad
                                        y privacidad recogidos en este documento, por lo que deberá ser único y de
                                        obligatoria cumplimentación.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Número de teléfono: el número de teléfono personal del titular de la cuenta se
                                        usará para su identificación personal, por lo que es de obligatoria
                                        cumplimentación.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        DNI o NIF: el DNI o NIF de la persona titular de la cuenta se usará
                                        para su identificación personal. Será obligatorio para los empleados y jefe del
                                        establecimiento, pero no para usuarios comunes.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Contraseña: la contraseña del titular de la cuenta se utilizará para verificar
                                        su identidad al acceder al Sitio Web. Deberá ser segura, privada e
                                        intransferible, por lo que es de obligatoria cumplimentación.
                                    </Typography></li>
                                </ul>
                                <Typography variant="body1" gutterBottom>
                                    En algunas secciones del Sitio Web se podrá requerir el pago de cantidades
                                    específicas tanto a eBar como a terceros para hacer uso de los servicios
                                    proporcionados. Para ello, eBar deberá recoger y procesar los métodos de pago que el
                                    Usuario proporcione y hacer llegar esta información a los servicios externos
                                    correspondientes. Es por eso que al hacer uso de dichos servicios el Usuario está
                                    aceptando sus términos y condiciones.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Asimismo, el Sitio Web podrá requerir al Usuario información sobre su ubicación para
                                    que pueda disfrutar de ciertos servicios. Para ello, eBar deberá recoger y procesar
                                    la información de la ubicación del Usuario y comunicarse con el servicio de mapas
                                    externo al Sitio Web. Al usar el Sitio Web, el Usuario acepta los términos y
                                    condiciones del sistema de mapas y geolocalización.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Períodos de retención de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Los datos personales solo serán retenidos durante el tiempo mínimo necesario para
                                    los
                                    fines de su tratamiento y, en todo caso, únicamente durante el siguiente plazo: 2
                                    años,
                                    o hasta que el Usuario solicite su supresión.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En el momento en que se obtengan los datos personales, se informará al Usuario
                                    acerca
                                    del plazo durante el cual se conservarán los datos personales o, cuando eso no sea
                                    posible, los criterios utilizados para determinar este plazo.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Destinatarios de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Los datos personales del Usuario no serán compartidos con terceros ajenos a los
                                    servicios prestados por el Sitio Web. Se recomienda al Usuario leer los términos y
                                    condiciones de los servicios de terceros que se incluyan en el Sitio Web.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En cualquier caso, en el momento en que se obtengan los datos personales, se
                                    informará
                                    al Usuario acerca de los destinatarios o las categorías de destinatarios de los
                                    datos
                                    personales.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Datos personales de menores de edad</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Respetando lo establecido en los artículos 8 del RGPD y 13 del RDLOPD, solo los
                                    mayores
                                    de 14 años podrán otorgar su consentimiento para el tratamiento de sus datos
                                    personales
                                    de forma lícita por eBar. Si se trata de un menor de 14 años, será necesario el
                                    consentimiento de los padres o tutores para el tratamiento, y este solo se
                                    considerará
                                    lícito en la medida en la que los mismos lo hayan autorizado.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Secreto y seguridad de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar se compromete a adoptar las medidas técnicas y organizativas necesarias, según
                                    el
                                    nivel de seguridad adecuado al riesgo de los datos recogidos, de forma que se
                                    garantice
                                    la seguridad de los datos de carácter personal y se evite la destrucción, pérdida o
                                    alteración accidental o ilícita de datos personales transmitidos, conservados o
                                    tratados
                                    de otra forma, o la comunicación o acceso no autorizados a dichos datos.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Sitio Web cuenta con un certificado SSL (Secure Socket Layer), que asegura que
                                    los
                                    datos personales se transmiten de forma segura y confidencial, al ser la transmisión
                                    de
                                    los datos entre el servidor y el Usuario, y en retroalimentación, totalmente cifrada
                                    o
                                    encriptada.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Sin embargo, debido a que eBar no puede garantizar la inexpugnabilidad de internet
                                    ni la ausencia total de hackers u otros que accedan de modo fraudulento a los datos
                                    personales, el Responsable del tratamiento se compromete a comunicar al Usuario sin
                                    dilación indebida cuando ocurra una violación de la seguridad de los datos
                                    personales que sea probable que entrañe un alto riesgo para los derechos y
                                    libertades de las
                                    personas físicas. Siguiendo lo establecido en el artículo 4 del RGPD, se entiende
                                    por violación de la seguridad de los datos personales toda violación de la seguridad
                                    que
                                    ocasione la destrucción, pérdida o alteración accidental o ilícita de datos
                                    personales transmitidos, conservados o tratados de otra forma, o la comunicación o
                                    acceso no
                                    autorizados a dichos datos.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Los datos personales serán tratados como confidenciales por el Responsable del
                                    tratamiento, quien se compromete a informar de y a garantizar por medio de una
                                    obligación legal o contractual que dicha confidencialidad sea respetada por sus
                                    empleados, asociados, y toda persona a la cual le haga accesible la información.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Derechos derivados del tratamiento de los datos personales</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Usuario tiene sobre eBar y podrá, por tanto, ejercer frente al Responsable del
                                    tratamiento los siguientes derechos reconocidos en el RGPD:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho de acceso</i>: Es el derecho del Usuario a obtener confirmación de si
                                        eBar
                                        está tratando o no sus datos personales y, en caso afirmativo, obtener
                                        información
                                        sobre sus datos concretos de carácter personal y del tratamiento que eBar haya
                                        realizado o realice, así como, entre otra, de la información disponible sobre el
                                        origen de dichos datos y los destinatarios de las comunicaciones realizadas o
                                        previstas de los mismos.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho de rectificación</i>: Es el derecho del Usuario a que se modifiquen
                                        sus
                                        datos
                                        personales que resulten ser inexactos o, teniendo en cuenta los fines del
                                        tratamiento, incompletos.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho de supresión ("el derecho al olvido")</i>: Es el derecho del Usuario,
                                        siempre
                                        que la legislación vigente no establezca lo contrario, a obtener la supresión de
                                        sus
                                        datos personales cuando estos ya no sean necesarios para los fines para los
                                        cuales
                                        fueron recogidos o tratados; el Usuario haya retirado su consentimiento al
                                        tratamiento y este no cuente con otra base legal; el Usuario se oponga al
                                        tratamiento y no exista otro motivo legítimo para continuar con el mismo; los
                                        datos
                                        personales hayan sido tratados ilícitamente; los datos personales deban
                                        suprimirse
                                        en cumplimiento de una obligación legal; o los datos personales hayan sido
                                        obtenidos
                                        producto de una oferta directa de servicios de la sociedad de la información a
                                        un
                                        menor de 14 años. Además de suprimir los datos, el Responsable del tratamiento,
                                        teniendo en cuenta la tecnología disponible y el coste de su aplicación, deberá
                                        adoptar medidas razonables para informar a los responsables que estén tratando
                                        los
                                        datos personales de la solicitud del interesado de supresión de cualquier enlace
                                        a
                                        esos datos personales.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho a la limitación del tratamiento</i>: Es el derecho del Usuario a
                                        limitar
                                        el
                                        tratamiento de sus datos personales. El Usuario tiene derecho a obtener la
                                        limitación del tratamiento cuando impugne la exactitud de sus datos personales;
                                        el
                                        tratamiento sea ilícito; el Responsable del tratamiento ya no necesite los datos
                                        personales, pero el Usuario lo necesite para hacer reclamaciones; y cuando el
                                        Usuario se haya opuesto al tratamiento.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho a la portabilidad de los datos</i>: En caso de que el tratamiento se
                                        efectúe
                                        por medios automatizados, el Usuario tendrá derecho a recibir del Responsable
                                        del
                                        tratamiento sus datos personales en un formato estructurado, de uso común y
                                        lectura
                                        mecánica, y a transmitirlos a otro responsable del tratamiento. Siempre que sea
                                        técnicamente posible, el Responsable del tratamiento transmitirá directamente
                                        los
                                        datos a ese otro responsable.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho de oposición</i>: Es el derecho del Usuario a que no se lleve a cabo
                                        el
                                        tratamiento de sus datos de carácter personal o se cese el tratamiento de estos
                                        por
                                        parte de eBar.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        <i>Derecho a no ser objeto de una decisión basada únicamente en el
                                            tratamiento automatizado, incluida la elaboración de perfiles</i>: Es el
                                        derecho
                                        del
                                        Usuario a no ser objeto de una decisión individualizada basada únicamente en el
                                        tratamiento automatizado de sus datos personales, incluida la elaboración de
                                        perfiles, existente salvo que la legislación vigente establezca lo contrario.
                                    </Typography></li>
                                </ul>
                                <Typography variant="body1" gutterBottom>
                                    Así pues, el Usuario podrá ejercitar sus derechos mediante comunicación escrita
                                    dirigida
                                    al Responsable del tratamiento con el asunto "RGPD-eBar", especificando:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        Nombre, apellidos del Usuario y copia del DNI. En los casos en que se admita la
                                        representación, será también necesaria la identificación por el mismo medio de
                                        la
                                        persona que representa al Usuario, así como el documento acreditativo de la
                                        representación. La fotocopia del DNI podrá ser sustituida, por cualquier otro
                                        medio
                                        válido en derecho que acredite la identidad.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Petición con los motivos específicos de la solicitud o información a la que se
                                        quiere acceder.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Dirección de correo electrónico a efecto de notificaciones.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Fecha y firma del solicitante.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        Todo documento que acredite la petición que formula.
                                    </Typography></li>
                                </ul>
                                <Typography variant="body1" gutterBottom>
                                    Esta solicitud y todo otro documento adjunto podrá enviarse al siguiente correo
                                    electrónico: ebar.app.info@gmail.com
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Adicionalmente, el Sitio Web permite al Usuario el envío automático de peticiones
                                    dirigidas al Responsable del tratamiento para disfrutar del <i>Derecho de
                                    supresión</i> y del <i>Derecho a la portabilidad de los datos</i>.
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Reclamaciones ante la autoridad de control</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En caso de que el Usuario considere que existe un problema o infracción de la
                                    normativa
                                    vigente en la forma en la que se están tratando sus datos personales, tendrá derecho
                                    a
                                    la tutela judicial efectiva y a presentar una reclamación ante una autoridad de
                                    control,
                                    en particular, en el Estado en el que tenga su residencia habitual, lugar de trabajo
                                    o
                                    lugar de la supuesta infracción. En el caso de España, la autoridad de control es la
                                    Agencia Española de Protección de Datos (http://www.agpd.es).
                                </Typography>
                                <Typography component="h3" gutterBottom>
                                    <b>Aceptación y cambios en esta política de privacidad</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Es necesario que el Usuario haya leído y esté conforme con las condiciones sobre la
                                    protección de datos de carácter personal contenidas en esta Política de Privacidad,
                                    así
                                    como que acepte el tratamiento de sus datos personales para que el Responsable del
                                    tratamiento pueda proceder al mismo en la forma, durante los plazos y para las
                                    finalidades indicadas. El uso del Sitio Web implicará la aceptación de la Política
                                    de
                                    Privacidad de este.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar se reserva el derecho a modificar su Política de Privacidad, de acuerdo con su
                                    propio criterio, o motivado por un cambio legislativo, jurisprudencial o doctrinal
                                    de la
                                    Agencia Española de Protección de Datos. Los cambios o actualizaciones de esta
                                    Política
                                    de Privacidad no serán notificados de forma explícita al Usuario. Se recomienda al
                                    Usuario consultar esta página de forma periódica para estar al tanto de los últimos
                                    cambios o actualizaciones.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Esta Política de Privacidad fue actualizada el día 1 de mayo 2021 para adaptarse
                                    al
                                    Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de
                                    2016,
                                    relativo a la protección de las personas físicas en lo que respecta al tratamiento
                                    de
                                    datos personales y a la libre circulación de estos datos (RGPD) y a la Ley Orgánica
                                    3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los
                                    derechos
                                    digitales (LOPD).
                                </Typography>
                                <Typography component="h2" gutterBottom>
                                    <b>V. POLÍTICA DE ENLACES</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    El Usuario o tercero que realice un hipervínculo desde una página web de otro,
                                    distinto,
                                    sitio web al Sitio Web de eBar deberá saber que:
                                </Typography>
                                <ul>
                                    <li><Typography variant="body1" gutterBottom>
                                        No se permite la reproducción —total o parcialmente— de ninguno de los
                                        Contenidos
                                        y/o Servicios del Sitio Web sin autorización expresa de eBar.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        No se permite tampoco ninguna manifestación falsa, inexacta o incorrecta sobre
                                        el
                                        Sitio Web de eBar, ni sobre los Contenidos y/o Servicios de este.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        A excepción del hipervínculo, el sitio web en el que se establezca dicho
                                        hiperenlace
                                        no contendrá ningún elemento, de este Sitio Web, protegido como propiedad
                                        intelectual por el ordenamiento jurídico español, salvo autorización expresa de
                                        eBar.
                                    </Typography></li>
                                    <li><Typography variant="body1" gutterBottom>
                                        El establecimiento del hipervínculo no implicará la existencia de relaciones
                                        entre
                                        eBar y el titular del sitio web desde el cual se realice, ni el conocimiento y
                                        aceptación de eBar de los contenidos, servicios y/o actividades ofrecidas en
                                        dicho
                                        sitio web, y viceversa.
                                    </Typography></li>
                                </ul>
                                <Typography component="h2" gutterBottom>
                                    <b>VI. PROPIEDAD INTELECTUAL E INDUSTRIAL</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar por sí o como parte cesionaria, es titular de todos los derechos de propiedad
                                    intelectual e industrial del Sitio Web, así como de los elementos contenidos en el
                                    mismo
                                    (a título enunciativo y no exhaustivo, imágenes, sonido, audio, vídeo, software o
                                    textos, marcas o logotipos, combinaciones de colores, estructura y diseño, selección
                                    de
                                    materiales usados, programas de ordenador necesarios para su funcionamiento, acceso
                                    y
                                    uso, etc.). Serán, por consiguiente, obras protegidas como propiedad intelectual por
                                    el
                                    ordenamiento jurídico español, siéndoles aplicables tanto la normativa española y
                                    comunitaria en este campo, como los tratados internacionales relativos a la materia
                                    y
                                    suscritos por España.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Todos los derechos reservados. En virtud de lo dispuesto en la Ley de Propiedad
                                    Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la
                                    comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad
                                    o
                                    parte de los contenidos de esta página web, con fines comerciales, en cualquier
                                    soporte
                                    y por cualquier medio técnico, sin la autorización de eBar.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    En caso de que el Usuario o tercero considere que cualquiera de los Contenidos del
                                    Sitio
                                    Web suponga una violación de los derechos de protección de la propiedad intelectual,
                                    deberá comunicarlo inmediatamente a eBar a través de los datos de contacto del
                                    apartado
                                    de INFORMACIÓN GENERAL de este Aviso Legal y Condiciones Generales de Uso.
                                </Typography>
                                <Typography component="h2" gutterBottom>
                                    <b>VII. ACCIONES LEGALES, LEGISLACIÓN APLICABLE Y JURISDICCIÓN</b>
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    eBar se reserva la facultad de presentar las acciones civiles o penales que
                                    considere
                                    necesarias por la utilización indebida del Sitio Web y Contenidos, o por el
                                    incumplimiento de las presentes Condiciones.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    La relación entre el Usuario y eBar se regirá por la normativa vigente y de
                                    aplicación
                                    en el territorio español. De surgir cualquier controversia en relación con la
                                    interpretación y/o a la aplicación de estas Condiciones las partes someterán sus
                                    conflictos a la jurisdicción ordinaria sometiéndose a los jueces y tribunales que
                                    correspondan conforme a derecho.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Ultima modificación: 1 de mayo 2021
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Container>
            <Footer/>
        </div>
    );
}
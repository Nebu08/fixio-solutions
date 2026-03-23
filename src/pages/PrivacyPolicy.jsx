import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import './PrivacyPolicy.css';

const LAST_UPDATED = '21 de marzo de 2026';
const COMPANY = 'Fixio Solutions S.A.S.';
const NIT = '901.912.254-6';
const EMAIL = 'fixiosolutions@gmail.com';
const ADDRESS = 'Cra 16A #78-75, Bogotá D.C., Colombia';
const PHONE = '+57 311 6860336';

const sections = [
  {
    id: 'responsable',
    title: '1. Responsable del Tratamiento',
    content: `${COMPANY} (en adelante "Fixio Solutions"), con NIT ${NIT}, domiciliada en ${ADDRESS}, es la empresa responsable del tratamiento de los datos personales recopilados a través de la plataforma fixio.solutions y sus canales digitales asociados.

Contacto del Responsable:
- Correo electrónico: ${EMAIL}
- Teléfono: ${PHONE}
- Dirección: ${ADDRESS}`
  },
  {
    id: 'datos-recopilados',
    title: '2. Datos Personales Recopilados',
    content: `Fixio Solutions recopila las siguientes categorías de datos personales:

a) Datos de identificación: nombre completo, número de documento de identidad.
b) Datos de contacto: correo electrónico, número de teléfono (WhatsApp), dirección de entrega.
c) Datos de navegación: dirección IP, tipo de navegador, páginas visitadas, tiempo en el sitio (recopilados mediante cookies propias y de terceros).
d) Datos de transacción: historial de pedidos, productos adquiridos, método de pago utilizado (no almacenamos datos de tarjetas de crédito/débito).
e) Datos de cuenta: en caso de registro, contraseña (almacenada con cifrado), fotografía de perfil (solo si se usa inicio de sesión con Google).`
  },
  {
    id: 'finalidades',
    title: '3. Finalidades del Tratamiento',
    content: `Los datos recopilados se utilizan para las siguientes finalidades:

1. Gestión y procesamiento de pedidos y entregas.
2. Comunicación sobre el estado de órdenes, soporte postventa y garantías.
3. Creación y gestión de cuentas de usuario.
4. Procesamiento de pagos a través de plataformas autorizadas (MercadoPago).
5. Envío de comunicaciones comerciales y promocionales (solo con consentimiento expreso del titular).
6. Análisis estadístico y mejora de la experiencia en la plataforma.
7. Cumplimiento de obligaciones legales, contables y tributarias.
8. Prevención de fraudes y protección de la seguridad de la plataforma.`
  },
  {
    id: 'base-legal',
    title: '4. Base Legal del Tratamiento',
    content: `El tratamiento de datos personales se realiza con fundamento en:

- La Ley Estatutaria 1581 de 2012 y sus decretos reglamentarios (Decreto 1377 de 2013, compilado en el Decreto 1074 de 2015).
- El consentimiento expreso del titular, otorgado al registrarse en la plataforma o al realizar una compra.
- La ejecución de un contrato de compraventa en el que el titular es parte.
- El cumplimiento de obligaciones legales aplicables a Fixio Solutions.`
  },
  {
    id: 'derechos',
    title: '5. Derechos del Titular',
    content: `Como titular de datos personales, usted tiene los siguientes derechos, que puede ejercer en cualquier momento:

• Conocer, actualizar y rectificar sus datos personales.
• Solicitar prueba del consentimiento otorgado.
• Ser informado sobre el uso de sus datos.
• Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.
• Revocar el consentimiento y/o solicitar la supresión de sus datos, salvo que exista una obligación legal de conservarlos.
• Acceder de forma gratuita a sus datos personales tratados por Fixio Solutions.

Para ejercer estos derechos, envíe una solicitud a: ${EMAIL} indicando su nombre completo, identificación y detalle de la solicitud. Responderemos dentro de los 10 días hábiles siguientes a la recepción.`
  },
  {
    id: 'transferencias',
    title: '6. Transferencia y Transmisión de Datos',
    content: `Fixio Solutions podrá compartir sus datos personales con terceros únicamente en los siguientes casos:

- Procesadores de pago: MercadoPago (Mercado Libre S.R.L.), para gestionar transacciones de forma segura. Sus datos se tratan bajo la política de privacidad de MercadoPago.
- Servicios de autenticación: Google LLC, cuando el usuario escoge el inicio de sesión con Google. Se rige por la política de privacidad de Google.
- Operadores logísticos: empresas de mensajería y transporte para la entrega de pedidos fuera de Bogotá.
- Autoridades competentes: cuando sea requerido por mandato legal o judicial.

No vendemos, alquilamos ni cedemos sus datos a terceros con fines comerciales sin su consentimiento expreso.`
  },
  {
    id: 'cookies',
    title: '7. Uso de Cookies y Tecnologías Similares',
    content: `Nuestra plataforma utiliza cookies y tecnologías de seguimiento para:

- Mantener su sesión activa (cookies estrictamente necesarias).
- Recordar sus preferencias de navegación.
- Analizar el tráfico del sitio mediante herramientas de analítica (como Google Analytics).
- Mostrar contenido relevante.

Puede configurar su navegador para rechazar cookies. Sin embargo, esto puede afectar la funcionalidad de la plataforma. Al continuar navegando, acepta el uso de cookies conforme a esta política.`
  },
  {
    id: 'seguridad',
    title: '8. Medidas de Seguridad',
    content: `Fixio Solutions implementa medidas técnicas, administrativas y organizacionales para proteger sus datos contra acceso no autorizado, pérdida, alteración o divulgación:

- Cifrado SSL/TLS en todas las comunicaciones.
- Almacenamiento de contraseñas con algoritmos de hash seguros.
- Acceso restringido a datos personales solo para personal autorizado.
- Revisiones periódicas de seguridad.
- No almacenamos información de tarjetas de pago (manejada por MercadoPago).

En caso de una brecha de seguridad que afecte sus datos, le notificaremos en los plazos establecidos por la regulación aplicable.`
  },
  {
    id: 'retencion',
    title: '9. Tiempo de Retención de Datos',
    content: `Sus datos personales se conservarán durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados:

- Datos de cuenta: mientras mantenga una cuenta activa en la plataforma, y por 5 años adicionales tras su eliminación para efectos legales y contables.
- Datos de facturación y transacciones: 10 años según normativa tributaria colombiana.
- Datos de navegación y cookies: hasta 2 años desde su última visita.

Una vez vencidos estos plazos, los datos serán suprimidos o anonimizados de forma segura.`
  },
  {
    id: 'menores',
    title: '10. Menores de Edad',
    content: `Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente datos de menores de edad. Si usted es padre, madre o tutor y cree que su hijo ha proporcionado datos personales, contáctenos en ${EMAIL} para proceder con su eliminación inmediata.`
  },
  {
    id: 'cambios',
    title: '11. Modificaciones a esta Política',
    content: `Fixio Solutions se reserva el derecho de modificar esta Política de Tratamiento de Datos en cualquier momento. Cualquier cambio significativo será notificado a los titulares a través del correo electrónico registrado o mediante un aviso prominente en la plataforma, con al menos 10 días de anticipación.

La versión vigente siempre estará disponible en: fixio.solutions/privacy-policy`
  },
  {
    id: 'contacto',
    title: '12. Contacto y Quejas',
    content: `Para cualquier consulta, queja o ejercicio de sus derechos en materia de protección de datos personales:

📧 ${EMAIL}
📞 ${PHONE}
📍 ${ADDRESS}

También puede presentar su queja directamente ante la Superintendencia de Industria y Comercio de Colombia:
🌐 www.sic.gov.co`
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page animate-fade-in">
      <div className="privacy-hero">
        <div className="privacy-hero-icon">
          <Shield size={40} />
        </div>
        <h1>Política de Tratamiento de Datos Personales</h1>
        <p className="privacy-meta">
          <strong>Última actualización:</strong> {LAST_UPDATED} &nbsp;·&nbsp;
          <strong>Empresa:</strong> {COMPANY}
        </p>
        <p className="privacy-intro">
          En Fixio Solutions, la privacidad y seguridad de sus datos personales es nuestra prioridad. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su información, en cumplimiento de la Ley 1581 de 2012 (Colombia) y demás normativas aplicables.
        </p>
      </div>

      {/* Índice */}
      <div className="container privacy-layout">
        <aside className="privacy-toc glass">
          <h3>Contenido</h3>
          <ul>
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="toc-link">
                  <ChevronRight size={14} />
                  {s.title.replace(/^\d+\.\s/, '')}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="privacy-content">
          {sections.map(s => (
            <section key={s.id} id={s.id} className="privacy-section glass">
              <h2>{s.title}</h2>
              <div className="section-body">
                {s.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="privacy-footer-note glass">
            <p>
              Al registrarte, iniciar sesión con Google o realizar una compra en Fixio Solutions, confirmas que has leído y aceptas esta Política de Tratamiento de Datos Personales en su totalidad.
            </p>
            <p>
              <Link to="/" className="back-link">← Volver al inicio</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

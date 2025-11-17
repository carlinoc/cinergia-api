// app/api/libro-reclamaciones/route.js

import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

// const prisma = new PrismaClient();
function mockCreateReclamo(data) {
  return {
    id: Math.floor(Math.random() * 1000000),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar datos obligatorios
    if (!body.nombres || !body.apellidos || !body.email || !body.numeroDocumento) {
      return NextResponse.json(
        { message: 'Faltan datos obligatorios' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'El correo electrónico no es válido' },
        { status: 400 }
      );
    }

    // Generar número único de reclamo
    const numeroReclamo = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // // Guardar en la base de datos
    // const reclamo = await prisma.reclamo.create({
    //   data: {
    //     numeroReclamo,
    //     nombres: body.nombres,
    //     apellidos: body.apellidos,
    //     tipoDocumento: body.tipoDocumento,
    //     numeroDocumento: body.numeroDocumento,
    //     telefono: body.telefono || null,
    //     email: body.email,
    //     domicilio: body.domicilio || null,
    //     menorEdad: body.menorEdad || false,
    //     tipoReclamacion: body.tipoReclamacion,
    //     tipoBien: body.tipoBien,
    //     montoReclamado: body.montoReclamado ? parseFloat(body.montoReclamado) : null,
    //     numeroPedido: body.numeroPedido || null,
    //     fechaIncidente: new Date(body.fechaIncidente),
    //     detalle: body.detalle,
    //     pedido: body.pedido,
    //     estado: 'PENDIENTE',
    //   },
    // });

    // Simular la data que iría a Prisma
    const data = {
      numeroReclamo,
      nombres: body.nombres,
      apellidos: body.apellidos,
      tipoDocumento: body.tipoDocumento,
      numeroDocumento: body.numeroDocumento,
      telefono: body.telefono || null,
      email: body.email,
      domicilio: body.domicilio || null,
      menorEdad: body.menorEdad || false,
      tipoReclamacion: body.tipoReclamacion,
      tipoBien: body.tipoBien,
      montoReclamado: body.montoReclamado ? parseFloat(body.montoReclamado) : null,
      numeroPedido: body.numeroPedido || null,
      fechaIncidente: new Date(body.fechaIncidente),
      detalle: body.detalle,
      pedido: body.pedido,
      estado: "PENDIENTE",
      fechaRegistro: body.fechaRegistro || new Date(),
    };

    // 👉 Simular la creación en base de datos
    const reclamo = mockCreateReclamo(data);
    
    // Enviar correo de confirmación al usuario
    const mailOptionsUsuario = {
      from: process.env.SMTP_FROM,
      to: body.email,
      cc: process.env.EMPRESA_EMAIL || 'info@cinergia.lat',  // Empresa en copia
      subject: `Confirmación de ${body.tipoReclamacion} - ${numeroReclamo}`,
      html: generarEmailUsuario(body, numeroReclamo, reclamo),
    };

    // Enviar correo a la empresa
    const mailOptionsEmpresa = {
      from: process.env.SMTP_FROM,
      to: process.env.EMPRESA_EMAIL || 'info@cinergia.lat',
      subject: `⚠️ Nuevo ${body.tipoReclamacion} - ${numeroReclamo}`,
      html: generarEmailEmpresa(body, numeroReclamo, reclamo),
    };

    // Enviar ambos correos
    try {
      await transporter.sendMail(mailOptionsUsuario);
      
      //await transporter.sendMail(mailOptionsEmpresa);
    } catch (emailError) {
      console.error('Error al enviar correos:', emailError);
      // Aunque falle el email, el reclamo ya está guardado
    }

    return NextResponse.json({
      success: true,
      message: 'Reclamo registrado exitosamente',
      numeroReclamo,
      id: reclamo.id,
    });

  } catch (error) {
    console.error('Error al procesar el reclamo:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Error al procesar el reclamo. Por favor, inténtelo nuevamente.' 
      },
      { status: 500 }
    );
  }
}

// Función para generar el email del usuario
function generarEmailUsuario(body, numeroReclamo, reclamo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; margin: 0; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; padding: 20px; background-color: #f3f4f6; border-radius: 0 0 8px 8px; }
        .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
        .label { font-weight: bold; color: #2563eb; }
        .alert-box { background-color: #fef3c7; padding: 15px; margin: 15px 0; border-left: 4px solid #f59e0b; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div class="header">
          <h1 style="margin: 0;">✅ Confirmación de ${body.tipoReclamacion}</h1>
        </div>
        <div class="content">
          <p>Estimado(a) <strong>${body.nombres} ${body.apellidos}</strong>,</p>
          <p>Su ${body.tipoReclamacion.toLowerCase()} ha sido registrado exitosamente en nuestro Libro de Reclamaciones.</p>
          
          <div class="info-box">
            <p style="margin: 5px 0;"><span class="label">📋 Número de ${body.tipoReclamacion}:</span> ${numeroReclamo}</p>
            <p style="margin: 5px 0;"><span class="label">📅 Fecha de Registro:</span> ${new Date(reclamo.fechaRegistro).toLocaleDateString('es-PE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p style="margin: 5px 0;"><span class="label">🏷️ Tipo:</span> ${body.tipoReclamacion}</p>
            <p style="margin: 5px 0;"><span class="label">📊 Estado:</span> PENDIENTE</p>
          </div>

          <h3 style="color: #2563eb;">Detalles de su ${body.tipoReclamacion.toLowerCase()}:</h3>
          <div class="info-box">
            <p style="margin: 5px 0;"><span class="label">Bien Contratado:</span> ${body.tipoBien}</p>
            <p style="margin: 5px 0;"><span class="label">Fecha del Incidente:</span> ${new Date(body.fechaIncidente).toLocaleDateString('es-PE')}</p>
            ${body.numeroPedido ? `<p style="margin: 5px 0;"><span class="label">N° de Pedido:</span> ${body.numeroPedido}</p>` : ''}
            ${body.montoReclamado ? `<p style="margin: 5px 0;"><span class="label">Monto Reclamado:</span> S/. ${parseFloat(body.montoReclamado).toFixed(2)}</p>` : ''}
            <p style="margin: 10px 0 5px 0;"><span class="label">Detalle:</span></p>
            <p style="margin: 5px 0; padding-left: 15px;">${body.detalle}</p>
            <p style="margin: 10px 0 5px 0;"><span class="label">Pedido:</span></p>
            <p style="margin: 5px 0; padding-left: 15px;">${body.pedido}</p>
          </div>

          <div class="alert-box">
            <h3 style="margin-top: 0; color: #92400e;">⏱️ Plazo de Respuesta</h3>
            <p style="margin: 5px 0;"><strong>El proveedor deberá dar respuesta a su ${body.tipoReclamacion.toLowerCase()} en un plazo no mayor a quince (15) días hábiles, improrrogables.</strong></p>
          </div>

          <h3 style="color: #2563eb;">📜 Información Legal:</h3>
          <div class="info-box">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Nota:</strong> La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Privacidad:</strong> Sus datos personales serán tratados conforme a la Ley N° 29571 y Ley N° 29733.</p>
          </div>

          <p style="margin-top: 20px;">Nos pondremos en contacto con usted a la brevedad posible para dar seguimiento a su ${body.tipoReclamacion.toLowerCase()}.</p>
          <p>Atentamente,<br><strong>MNET E.I.R.L. - Cinergia</strong></p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;"><strong>MNET EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA</strong></p>
          <p style="margin: 5px 0;">RUC: 20607838250</p>
          <p style="margin: 5px 0;">Prolongación Pumacurco N° 650, Barrio San Cristóbal, Cusco, Perú</p>
          <p style="margin: 5px 0;">📧 info@cinergia.lat</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para generar el email de la empresa
function generarEmailEmpresa(body, numeroReclamo, reclamo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; margin: 0; }
        .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #dc2626; border-radius: 4px; }
        .label { font-weight: bold; color: #dc2626; }
        .alert { background-color: #fef2f2; border: 2px solid #dc2626; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .urgent { background-color: #fef3c7; padding: 12px; margin: 10px 0; border-left: 4px solid #f59e0b; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container" style="border: 2px solid #dc2626; border-radius: 8px; overflow: hidden;">
        <div class="header">
          <h1 style="margin: 0;">🔔 Nuevo ${body.tipoReclamacion}</h1>
          <p style="margin: 5px 0; font-size: 18px;">Libro de Reclamaciones</p>
        </div>
        <div class="content">
          <div class="alert">
            <p style="margin: 0; font-size: 16px;"><strong>⚠️ ATENCIÓN URGENTE:</strong> Se ha registrado un nuevo ${body.tipoReclamacion.toLowerCase()} en el Libro de Reclamaciones.</p>
          </div>

          <div class="urgent">
            <p style="margin: 0; font-size: 15px;"><strong>⏰ PLAZO DE RESPUESTA: 15 DÍAS HÁBILES</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 13px;">Fecha límite aproximada: ${calcularFechaLimite()}</p>
          </div>

          <h3 style="color: #dc2626;">👤 Información del Consumidor:</h3>
          <div class="info-box">
            <p style="margin: 5px 0;"><span class="label">Nombre Completo:</span> ${body.nombres} ${body.apellidos}</p>
            <p style="margin: 5px 0;"><span class="label">Documento:</span> ${body.tipoDocumento} - ${body.numeroDocumento}</p>
            <p style="margin: 5px 0;"><span class="label">📧 Email:</span> <a href="mailto:${body.email}">${body.email}</a></p>
            <p style="margin: 5px 0;"><span class="label">📱 Teléfono:</span> ${body.telefono || 'No proporcionado'}</p>
            <p style="margin: 5px 0;"><span class="label">🏠 Domicilio:</span> ${body.domicilio || 'No proporcionado'}</p>
            ${body.menorEdad ? '<p style="margin: 5px 0; color: #dc2626;"><span class="label">⚠️ REPRESENTA A UN MENOR DE EDAD</span></p>' : ''}
          </div>

          <h3 style="color: #dc2626;">📋 Detalles del ${body.tipoReclamacion}:</h3>
          <div class="info-box">
            <p style="margin: 5px 0;"><span class="label">Número de Registro:</span> ${numeroReclamo}</p>
            <p style="margin: 5px 0;"><span class="label">ID en Base de Datos:</span> #${reclamo.id}</p>
            <p style="margin: 5px 0;"><span class="label">Tipo:</span> ${body.tipoReclamacion}</p>
            <p style="margin: 5px 0;"><span class="label">Bien Contratado:</span> ${body.tipoBien}</p>
            <p style="margin: 5px 0;"><span class="label">Fecha del Incidente:</span> ${new Date(body.fechaIncidente).toLocaleDateString('es-PE')}</p>
            <p style="margin: 5px 0;"><span class="label">Fecha de Registro:</span> ${new Date(reclamo.fechaRegistro).toLocaleDateString('es-PE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</p>
            ${body.numeroPedido ? `<p style="margin: 5px 0;"><span class="label">N° de Pedido/Alquiler:</span> ${body.numeroPedido}</p>` : ''}
            ${body.montoReclamado ? `<p style="margin: 5px 0;"><span class="label">💰 Monto Reclamado:</span> <strong>S/. ${parseFloat(body.montoReclamado).toFixed(2)}</strong></p>` : ''}
          </div>

          <h3 style="color: #dc2626;">📝 Descripción del Problema:</h3>
          <div class="info-box">
            <p style="margin: 0; background-color: #f9fafb; padding: 10px; border-radius: 4px;">${body.detalle}</p>
          </div>

          <h3 style="color: #dc2626;">🎯 Pedido del Consumidor:</h3>
          <div class="info-box">
            <p style="margin: 0; background-color: #f9fafb; padding: 10px; border-radius: 4px;">${body.pedido}</p>
          </div>

          <div class="alert">
            <h4 style="margin-top: 0; color: #dc2626;">⚡ Acciones Requeridas:</h4>
            <ol style="margin: 5px 0; padding-left: 20px;">
              <li>Revisar el reclamo en el sistema administrativo</li>
              <li>Contactar al cliente dentro de las próximas 24-48 horas</li>
              <li>Investigar el caso reportado</li>
              <li>Preparar respuesta formal antes de los 15 días hábiles</li>
              <li>Registrar la respuesta en el Libro de Reclamaciones</li>
            </ol>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            <strong>Nota:</strong> Este es un mensaje automático del sistema de Libro de Reclamaciones. 
            Por favor, dar seguimiento inmediato a este caso.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función auxiliar para calcular fecha límite
function calcularFechaLimite() {
  const fecha = new Date();
  let diasHabiles = 0;
  
  while (diasHabiles < 15) {
    fecha.setDate(fecha.getDate() + 1);
    const diaSemana = fecha.getDay();
    // Si no es sábado (6) ni domingo (0)
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasHabiles++;
    }
  }
  
  return fecha.toLocaleDateString('es-PE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatFecha(fecha) {
  const date = new Date(fecha);

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
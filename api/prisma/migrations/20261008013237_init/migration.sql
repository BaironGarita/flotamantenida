-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rol_id` INTEGER NOT NULL,
    `nombre_completo` VARCHAR(150) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `contrasena_hash` VARCHAR(255) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ultimo_acceso` DATETIME(3) NULL,

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados_activo` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `estados_activo_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados_orden` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `estados_orden_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clases_mantenimiento` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `clases_mantenimiento_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prioridades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `nivel` INTEGER NOT NULL,

    UNIQUE INDEX `prioridades_nombre_key`(`nombre`),
    UNIQUE INDEX `prioridades_nivel_key`(`nivel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `niveles_criticidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `niveles_criticidad_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_combustible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `tipos_combustible_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidades_medida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `abreviatura` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `unidades_medida_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `niveles_certificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `nivel` INTEGER NOT NULL,

    UNIQUE INDEX `niveles_certificacion_nombre_key`(`nombre`),
    UNIQUE INDEX `niveles_certificacion_nivel_key`(`nivel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marcas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `marcas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modelos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marca_id` INTEGER NOT NULL,
    `nombre` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `modelos_marca_id_nombre_key`(`marca_id`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias_activo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `intervalo_km` INTEGER UNSIGNED NOT NULL,
    `margen_alerta_km` INTEGER UNSIGNED NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `categorias_activo_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `placa` VARCHAR(20) NOT NULL,
    `modelo_id` INTEGER NOT NULL,
    `anio` SMALLINT UNSIGNED NOT NULL,
    `tipo_combustible_id` INTEGER NOT NULL,
    `categoria_id` INTEGER NOT NULL,
    `nivel_criticidad_id` INTEGER NOT NULL,
    `estado_activo_id` INTEGER NOT NULL,
    `fecha_adquisicion` DATE NOT NULL,
    `valor_referencia` DECIMAL(14, 2) NOT NULL,
    `kilometraje_registro` INTEGER UNSIGNED NOT NULL,
    `kilometraje_actual` INTEGER UNSIGNED NOT NULL,
    `imagen_url` VARCHAR(500) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `activos_codigo_key`(`codigo`),
    UNIQUE INDEX `activos_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `especialidades_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identificacion` VARCHAR(20) NOT NULL,
    `nombre_completo` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `tarifa_hora` DECIMAL(10, 2) NOT NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `tecnicos_identificacion_key`(`identificacion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnico_especialidad` (
    `tecnico_id` INTEGER NOT NULL,
    `especialidad_id` INTEGER NOT NULL,
    `nivel_certificacion_id` INTEGER NOT NULL,
    `fecha_certificacion` DATE NOT NULL,

    PRIMARY KEY (`tecnico_id`, `especialidad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repuestos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `unidad_medida_id` INTEGER NOT NULL,
    `stock_actual` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `stock_minimo` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `repuestos_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cedula_juridica` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `contacto` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `condiciones_generales` VARCHAR(500) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `proveedores_cedula_juridica_key`(`cedula_juridica`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repuesto_proveedor` (
    `repuesto_id` INTEGER NOT NULL,
    `proveedor_id` INTEGER NOT NULL,
    `precio` DECIMAL(12, 2) NOT NULL,
    `tiempo_entrega_dias` SMALLINT UNSIGNED NOT NULL,

    PRIMARY KEY (`repuesto_id`, `proveedor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `clase_mantenimiento_id` INTEGER NOT NULL,
    `especialidad_id` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `tipos_mantenimiento_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes_mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `activo_id` INTEGER NOT NULL,
    `tipo_mantenimiento_id` INTEGER NOT NULL,
    `prioridad_id` INTEGER NULL,
    `estado_orden_id` INTEGER NOT NULL,
    `usuario_solicitante_id` INTEGER NOT NULL,
    `motivo` VARCHAR(500) NOT NULL,
    `diagnostico` VARCHAR(1000) NULL,
    `kilometraje_al_solicitar` INTEGER UNSIGNED NOT NULL,
    `fecha_solicitud` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_programada` DATE NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_cierre` DATETIME(3) NULL,
    `costo_total` DECIMAL(14, 2) NOT NULL DEFAULT 0,

    UNIQUE INDEX `ordenes_mantenimiento_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_tecnico` (
    `orden_id` INTEGER NOT NULL,
    `tecnico_id` INTEGER NOT NULL,
    `fecha_asignacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `horas_trabajadas` DECIMAL(6, 2) NOT NULL DEFAULT 0,
    `tarifa_hora_aplicada` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`orden_id`, `tecnico_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_repuesto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orden_id` INTEGER NOT NULL,
    `repuesto_id` INTEGER NOT NULL,
    `proveedor_id` INTEGER NOT NULL,
    `cantidad` INTEGER UNSIGNED NOT NULL,
    `costo_unitario` DECIMAL(12, 2) NOT NULL,
    `pendiente` BOOLEAN NOT NULL DEFAULT false,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_estado_activo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activo_id` INTEGER NOT NULL,
    `estado_anterior_id` INTEGER NULL,
    `estado_nuevo_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `orden_id` INTEGER NULL,
    `fecha_cambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacion` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_estado_orden` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orden_id` INTEGER NOT NULL,
    `estado_anterior_id` INTEGER NULL,
    `estado_nuevo_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `fecha_cambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacion` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modelos` ADD CONSTRAINT `modelos_marca_id_fkey` FOREIGN KEY (`marca_id`) REFERENCES `marcas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activos` ADD CONSTRAINT `activos_modelo_id_fkey` FOREIGN KEY (`modelo_id`) REFERENCES `modelos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activos` ADD CONSTRAINT `activos_tipo_combustible_id_fkey` FOREIGN KEY (`tipo_combustible_id`) REFERENCES `tipos_combustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activos` ADD CONSTRAINT `activos_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_activo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activos` ADD CONSTRAINT `activos_nivel_criticidad_id_fkey` FOREIGN KEY (`nivel_criticidad_id`) REFERENCES `niveles_criticidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activos` ADD CONSTRAINT `activos_estado_activo_id_fkey` FOREIGN KEY (`estado_activo_id`) REFERENCES `estados_activo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tecnico_especialidad` ADD CONSTRAINT `tecnico_especialidad_tecnico_id_fkey` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tecnico_especialidad` ADD CONSTRAINT `tecnico_especialidad_especialidad_id_fkey` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tecnico_especialidad` ADD CONSTRAINT `tecnico_especialidad_nivel_certificacion_id_fkey` FOREIGN KEY (`nivel_certificacion_id`) REFERENCES `niveles_certificacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repuestos` ADD CONSTRAINT `repuestos_unidad_medida_id_fkey` FOREIGN KEY (`unidad_medida_id`) REFERENCES `unidades_medida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repuesto_proveedor` ADD CONSTRAINT `repuesto_proveedor_repuesto_id_fkey` FOREIGN KEY (`repuesto_id`) REFERENCES `repuestos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repuesto_proveedor` ADD CONSTRAINT `repuesto_proveedor_proveedor_id_fkey` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tipos_mantenimiento` ADD CONSTRAINT `tipos_mantenimiento_clase_mantenimiento_id_fkey` FOREIGN KEY (`clase_mantenimiento_id`) REFERENCES `clases_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tipos_mantenimiento` ADD CONSTRAINT `tipos_mantenimiento_especialidad_id_fkey` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordenes_mantenimiento` ADD CONSTRAINT `ordenes_mantenimiento_activo_id_fkey` FOREIGN KEY (`activo_id`) REFERENCES `activos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordenes_mantenimiento` ADD CONSTRAINT `ordenes_mantenimiento_tipo_mantenimiento_id_fkey` FOREIGN KEY (`tipo_mantenimiento_id`) REFERENCES `tipos_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordenes_mantenimiento` ADD CONSTRAINT `ordenes_mantenimiento_prioridad_id_fkey` FOREIGN KEY (`prioridad_id`) REFERENCES `prioridades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordenes_mantenimiento` ADD CONSTRAINT `ordenes_mantenimiento_estado_orden_id_fkey` FOREIGN KEY (`estado_orden_id`) REFERENCES `estados_orden`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordenes_mantenimiento` ADD CONSTRAINT `ordenes_mantenimiento_usuario_solicitante_id_fkey` FOREIGN KEY (`usuario_solicitante_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_tecnico` ADD CONSTRAINT `orden_tecnico_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_tecnico` ADD CONSTRAINT `orden_tecnico_tecnico_id_fkey` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnicos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_repuesto` ADD CONSTRAINT `orden_repuesto_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_repuesto` ADD CONSTRAINT `orden_repuesto_repuesto_id_fkey` FOREIGN KEY (`repuesto_id`) REFERENCES `repuestos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_repuesto` ADD CONSTRAINT `orden_repuesto_proveedor_id_fkey` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_activo` ADD CONSTRAINT `historial_estado_activo_activo_id_fkey` FOREIGN KEY (`activo_id`) REFERENCES `activos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_activo` ADD CONSTRAINT `historial_estado_activo_estado_anterior_id_fkey` FOREIGN KEY (`estado_anterior_id`) REFERENCES `estados_activo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_activo` ADD CONSTRAINT `historial_estado_activo_estado_nuevo_id_fkey` FOREIGN KEY (`estado_nuevo_id`) REFERENCES `estados_activo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_activo` ADD CONSTRAINT `historial_estado_activo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_activo` ADD CONSTRAINT `historial_estado_activo_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_orden` ADD CONSTRAINT `historial_estado_orden_orden_id_fkey` FOREIGN KEY (`orden_id`) REFERENCES `ordenes_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_orden` ADD CONSTRAINT `historial_estado_orden_estado_anterior_id_fkey` FOREIGN KEY (`estado_anterior_id`) REFERENCES `estados_orden`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_orden` ADD CONSTRAINT `historial_estado_orden_estado_nuevo_id_fkey` FOREIGN KEY (`estado_nuevo_id`) REFERENCES `estados_orden`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estado_orden` ADD CONSTRAINT `historial_estado_orden_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

BEGIN;


CREATE TABLE IF NOT EXISTS public.cart_items
(
    cart_item_id serial NOT NULL,
    customer_id integer NOT NULL,
    part_id integer NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_items_pkey PRIMARY KEY (cart_item_id),
    CONSTRAINT cart_items_customer_id_part_id_key UNIQUE (customer_id, part_id)
);

CREATE TABLE IF NOT EXISTS public.customers
(
    customer_id serial NOT NULL,
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    address character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true,
    CONSTRAINT customers_pkey PRIMARY KEY (customer_id),
    CONSTRAINT customers_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.employees
(
    employee_id serial NOT NULL,
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default",
    hire_date date DEFAULT CURRENT_DATE,
    salary numeric(10, 2),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    store_id integer,
    CONSTRAINT employees_pkey PRIMARY KEY (employee_id),
    CONSTRAINT employees_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.inventory
(
    inventory_id serial NOT NULL,
    store_id integer NOT NULL,
    part_id integer NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    reorder_level integer DEFAULT 10,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inventory_pkey PRIMARY KEY (inventory_id),
    CONSTRAINT inventory_store_id_part_id_key UNIQUE (store_id, part_id)
);

CREATE TABLE IF NOT EXISTS public.order_items
(
    order_item_id serial NOT NULL,
    order_id integer NOT NULL,
    part_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL,
    subtotal numeric(10, 2) NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id)
);

CREATE TABLE IF NOT EXISTS public.orders
(
    order_id serial NOT NULL,
    customer_id integer NOT NULL,
    employee_id integer,
    payment_method_id integer,
    total_amount numeric(10, 2) NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_date timestamp without time zone,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);

CREATE TABLE IF NOT EXISTS public.part_compatibility
(
    compatibility_id serial NOT NULL,
    part_id integer NOT NULL,
    make character varying(50) COLLATE pg_catalog."default" NOT NULL,
    model character varying(50) COLLATE pg_catalog."default" NOT NULL,
    year_start integer NOT NULL,
    year_end integer,
    CONSTRAINT part_compatibility_pkey PRIMARY KEY (compatibility_id)
);

CREATE TABLE IF NOT EXISTS public.parts
(
    part_id serial NOT NULL,
    part_number character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    manufacturer character varying(100) COLLATE pg_catalog."default",
    category character varying(50) COLLATE pg_catalog."default",
    price numeric(10, 2) NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'available'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parts_pkey PRIMARY KEY (part_id),
    CONSTRAINT parts_part_number_key UNIQUE (part_number)
);

CREATE TABLE IF NOT EXISTS public.payment_methods
(
    payment_method_id serial NOT NULL,
    customer_id integer NOT NULL,
    card_type character varying(20) COLLATE pg_catalog."default",
    masked_card_number character varying(20) COLLATE pg_catalog."default",
    card_holder_name character varying(100) COLLATE pg_catalog."default",
    expiry_date date,
    is_default boolean DEFAULT false,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_methods_pkey PRIMARY KEY (payment_method_id)
);

CREATE TABLE IF NOT EXISTS public.returns
(
    return_id serial NOT NULL,
    order_id integer NOT NULL,
    order_item_id integer NOT NULL,
    reason text COLLATE pg_catalog."default",
    quantity integer NOT NULL,
    refund_amount numeric(10, 2) NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    requested_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    processed_date timestamp without time zone,
    CONSTRAINT returns_pkey PRIMARY KEY (return_id)
);

CREATE TABLE IF NOT EXISTS public.stores
(
    store_id serial NOT NULL,
    store_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    email character varying(100) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stores_pkey PRIMARY KEY (store_id)
);

CREATE TABLE IF NOT EXISTS public.vehicles
(
    vehicle_id serial NOT NULL,
    customer_id integer NOT NULL,
    make character varying(50) COLLATE pg_catalog."default" NOT NULL,
    model character varying(50) COLLATE pg_catalog."default" NOT NULL,
    year integer NOT NULL,
    vin character varying(17) COLLATE pg_catalog."default",
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id),
    CONSTRAINT vehicles_vin_key UNIQUE (vin)
);

ALTER TABLE IF EXISTS public.cart_items
    ADD CONSTRAINT cart_items_customer_id_fkey FOREIGN KEY (customer_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.cart_items
    ADD CONSTRAINT cart_items_part_id_fkey FOREIGN KEY (part_id)
    REFERENCES public.parts (part_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.inventory
    ADD CONSTRAINT inventory_part_id_fkey FOREIGN KEY (part_id)
    REFERENCES public.parts (part_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.inventory
    ADD CONSTRAINT inventory_store_id_fkey FOREIGN KEY (store_id)
    REFERENCES public.stores (store_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id)
    REFERENCES public.orders (order_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.order_items
    ADD CONSTRAINT order_items_part_id_fkey FOREIGN KEY (part_id)
    REFERENCES public.parts (part_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT orders_employee_id_fkey FOREIGN KEY (employee_id)
    REFERENCES public.employees (employee_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT orders_payment_method_id_fkey FOREIGN KEY (payment_method_id)
    REFERENCES public.payment_methods (payment_method_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.part_compatibility
    ADD CONSTRAINT part_compatibility_part_id_fkey FOREIGN KEY (part_id)
    REFERENCES public.parts (part_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.payment_methods
    ADD CONSTRAINT payment_methods_customer_id_fkey FOREIGN KEY (customer_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.returns
    ADD CONSTRAINT returns_order_id_fkey FOREIGN KEY (order_id)
    REFERENCES public.orders (order_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.returns
    ADD CONSTRAINT returns_order_item_id_fkey FOREIGN KEY (order_item_id)
    REFERENCES public.order_items (order_item_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.vehicles
    ADD CONSTRAINT vehicles_customer_id_fkey FOREIGN KEY (customer_id)
    REFERENCES public.customers (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


END;

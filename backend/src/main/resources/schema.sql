-- PostgreSQL Table Schema for gershon/watches webshop

CREATE TABLE IF NOT EXISTS watches (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NULL, -- Price can be NULL for "Price on Request"
    image_url VARCHAR(2048),
    description VARCHAR(4096),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

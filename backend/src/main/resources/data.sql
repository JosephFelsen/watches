-- Initial Seed Data for PostgreSQL

INSERT INTO watches (name, brand, price, image_url, description, created_at)
SELECT 'Gershon Royal Chronograph Rose Gold', 'Gershon Genève', 34500.00, '/images/watch1.png', 'Handcrafted 18k rose gold chronograph featuring obsidian guilloché dial, self-winding mechanical movement.', NOW()
WHERE NOT EXISTS (SELECT 1 FROM watches WHERE name = 'Gershon Royal Chronograph Rose Gold');

INSERT INTO watches (name, brand, price, image_url, description, created_at)
SELECT 'Grand Tourbillon Skeleton Edition', 'Gershon Atelier', 89000.00, '/images/watch2.png', 'High complication skeletonized tourbillon encased in polished 950 platinum.', NOW()
WHERE NOT EXISTS (SELECT 1 FROM watches WHERE name = 'Grand Tourbillon Skeleton Edition');

INSERT INTO watches (name, brand, price, image_url, description, created_at)
SELECT 'Nautilus Vintage Golden Sunburst', 'Gershon Heritage', NULL, '/images/watch3.png', 'Ultra-rare vintage golden dress timepiece. Price on Request.', NOW()
WHERE NOT EXISTS (SELECT 1 FROM watches WHERE name = 'Nautilus Vintage Golden Sunburst');

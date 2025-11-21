-- Sample parts insert script for Auto Parts database
-- Run this in psql connected to your `ap_db` database.

INSERT INTO parts (part_number, name, description, manufacturer, category, price, status)
VALUES
('AP-1001', 'Oil Filter', 'High-efficiency oil filter for most vehicles', 'AutoParts Co', 'engine', 9.99, 'available'),
('AP-1002', 'Air Filter', 'Premium air filter for improved engine breathing', 'FilterWorks', 'engine', 14.5, 'available'),
('AP-2001', 'Brake Pad Set', 'Front brake pads (set of 4)', 'BrakeMasters', 'brakes', 45.0, 'available'),
('AP-2002', 'Brake Rotor', 'Front brake rotor', 'RotorTech', 'brakes', 79.99, 'available'),
('AP-3001', 'Shock Absorber', 'Rear shock absorber', 'RideWell', 'suspension', 120.0, 'available'),
('AP-4001', 'Alternator', '12V alternator, direct fit', 'ElectroDrive', 'electrical', 199.99, 'available'),
('AP-5001', 'Exhaust Muffler', 'Universal fit muffler', 'ExhaustPro', 'exhaust', 89.99, 'available'),
('AP-6001', 'Clutch Kit', 'Clutch kit for manual transmissions', 'TransWorks', 'transmission', 249.99, 'available'),
('AP-7001', 'Spark Plug', 'Iridium spark plug', 'IgniteCorp', 'electrical', 7.5, 'available'),
('AP-8001', 'Fuel Pump', 'Electric fuel pump assembly', 'FuelFlow', 'engine', 129.99, 'available');

-- Additional sample parts
INSERT INTO parts (part_number, name, description, manufacturer, category, price, status)
VALUES
('AP-1003', 'PCV Valve', 'Positive crankcase ventilation valve', 'ValveTech', 'engine', 12.99, 'available'),
('AP-1004', 'Timing Belt', 'Genuine timing belt replacement', 'BeltWorks', 'engine', 89.0, 'available'),
('AP-1101', 'Radiator', 'Aluminum radiator assembly', 'CoolFlow', 'cooling', 219.99, 'available'),
('AP-1201', 'Water Pump', 'High-flow water pump', 'CoolFlow', 'cooling', 79.5, 'available'),
('AP-2101', 'Brake Caliper', 'Single-piston brake caliper', 'BrakeMasters', 'brakes', 59.99, 'available'),
('AP-2102', 'Brake Hose', 'Braided brake hose', 'BrakeFlex', 'brakes', 24.99, 'available'),
('AP-3101', 'Control Arm', 'Front lower control arm', 'RideWell', 'suspension', 89.99, 'available'),
('AP-3102', 'Strut Mount', 'Front strut mount bearing', 'RideWell', 'suspension', 29.99, 'available'),
('AP-4101', 'Starter Motor', '12V starter', 'ElectroDrive', 'electrical', 149.99, 'available'),
('AP-4102', 'Ignition Coil', 'Direct-fit ignition coil', 'IgniteCorp', 'electrical', 34.5, 'available'),
('AP-5101', 'Catalytic Converter', 'Direct-fit cat for emissions', 'ExhaustPro', 'exhaust', 349.99, 'available'),
('AP-6101', 'Flywheel', 'Dual-mass flywheel', 'TransWorks', 'transmission', 199.0, 'available'),
('AP-7101', 'O2 Sensor', 'Oxygen sensor upstream', 'SensePro', 'electrical', 49.99, 'available'),
('AP-8101', 'Fuel Injector', 'Multiport fuel injector', 'FuelFlow', 'engine', 39.99, 'available'),
('AP-9001', 'Power Steering Pump', 'Hydraulic steering pump', 'SteerRight', 'steering', 129.0, 'available'),
('AP-9002', 'Tie Rod End', 'Outer tie rod end', 'SteerRight', 'steering', 24.99, 'available'),
('AP-10001','Hood Latch','Hood latch assembly','BodyWorks','body',19.99,'available'),
('AP-10002','Door Handle','Exterior door handle','BodyWorks','body',14.99,'available'),
('AP-11002','Seat Belt','Front seat belt assembly','SafeGuard','interior',59.99,'available'),
('AP-12002','Airbag Module','Driver-side airbag module','SafeGuard','safety',249.99,'available'),
('AP-13001','Headlight','Halogen headlight assembly','LightCo','lighting',69.99,'available'),
('AP-13002','Taillight','LED taillight assembly','LightCo','lighting',79.99,'available'),
('AP-14001','Battery','Group 35 lead-acid battery','PowerCell','electrical',119.99,'available'),
('AP-15001','Belts & Hoses Kit','Engine belts and hoses kit','BeltWorks','engine',59.99,'available'),
('AP-16001','Wheel Bearing','Front wheel bearing hub','WheelPro','suspension',99.99,'available'),
('AP-17001','Window Motor','Power window motor','BodyWorks','electrical',89.99,'available'),
('AP-18001','AC Compressor','A/C compressor assembly','CoolFlow','climate',229.99,'available'),
('AP-19001','Thermostat','Engine thermostat assembly','CoolFlow','cooling',19.99,'available');

-- Optionally verify inserted rows
SELECT part_id, part_number, name, price FROM parts ORDER BY part_id DESC LIMIT 20;

SELECT 'CREATE DATABASE puppysignal'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'puppysignal')\gexec
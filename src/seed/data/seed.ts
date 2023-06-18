import * as bcrypt from 'bcrypt';
interface SeedUser {
  email: string;
  nombreCompleto: string;
  password: string;
  fechaActualizacion: Date;
  roles: string[];
}

interface SeedData {
    users: SeedUser[];
}

export const initialData: SeedData = {
    users: [
        {
            email: "Juan.herrera@gmail.com",
            nombreCompleto: "Juan Herrera",
            password: bcrypt.hashSync("Juan123", 10),
            fechaActualizacion: new Date,
            roles: ['admin, super-user']
        },
        {
            email: "angela.silva@gmail.com",
            nombreCompleto: "Angela Silva",
            password: bcrypt.hashSync("Angela123", 10),
            fechaActualizacion: new Date,
            roles: ['admin']
        },
        {
            email: "maite.herrera@gmail.com",
            nombreCompleto: "Maite Herrera",
            password: bcrypt.hashSync("Maite123", 10),
            fechaActualizacion: new Date,
            roles: ['user']
        }
    ]
}

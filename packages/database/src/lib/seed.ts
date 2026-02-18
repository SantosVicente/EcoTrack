import { getDb } from '../index.js';
import * as schema from './schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Criar Usuário Base (John Doe)
  const passwordHash =
    '$2b$10$ep2.Z7e0.Z7e0.Z7e0.Z7e0.Z7e0.Z7e0.Z7e0.Z7e0.Z7e0.Z7e0';

  const db = getDb();

  const [user] = await db
    .insert(schema.users)
    .values({
      firstName: 'Jhon',
      lastName: 'Doe',
      avatarUrl: 'https://github.com/shadcn.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: 'john.doe@example.com',
      passwordHash: passwordHash,
    })
    .onConflictDoNothing()
    .returning();

  const userId =
    user?.id ||
    (
      await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, 'john.doe@example.com'),
      })
    )?.id;

  if (!userId) {
    throw new Error('Could not find or create user John Doe');
  }

  console.log(`✅ User John Doe ready! (ID: ${userId})`);

  // 2. Criar uma Source (Ex: Prédio Central)
  const [source] = await db
    .insert(schema.sources)
    .values({
      createdById: userId,
      name: 'Prédio Central',
      type: 'SENSOR',
      location: 'Andar 1 - Ala Sul',
      metadata: { floor: 1, department: 'TI' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Source ${source ? source.name : 'Prédio Central'} ready!`);

  // 3. Criar outra Source (Ex: API Externa de Clima)
  const [sourceApi] = await db
    .insert(schema.sources)
    .values({
      createdById: userId,
      name: 'API Clima Tempo',
      type: 'API',
      location: 'Cloud',
      metadata: { provider: 'OpenWeather' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoNothing()
    .returning();

  console.log(
    `✅ Source ${sourceApi ? sourceApi.name : 'API Clima Tempo'} ready!`
  );

  console.log('✨ Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed!');
  console.error(err);
  process.exit(1);
});

import "reflect-metadata";
import { createConnection, getManager } from "typeorm";

import { User } from "./entity/User";
import { Profile } from "./entity/Profile";
import { Photo } from "./entity/Photo";


const main = async () => {
  await createConnection();

  const manager = getManager();

  console.log("Inserting a new user into the database...");

  const user = new User();
  user.firstName = "Timber";
  user.lastName = "Saw";
  user.profile = new Profile();
  user.profile.about = "About Trees and Me";
  user.profile.education = "Tree School";
  user.profile.career = "Lumberjack";
  user.profile.photos = [
    new Photo("me-and-trees.jpg", "Me and Trees", 100),
    new Photo("me-and-chakram.jpg", "Me and Chakram", 200),
  ];

  await manager.save(user);
  console.log("Saved a new user with id: " + user.id);



  const photo = new Photo("unknown.jpg", "Upserted photo", 300);

  // Ugly, maybe unsafe, IDK
  manager.update(
    User,
    { firstName: "Timber" },
    { profile: () => `jsonb_insert(profile,'{photos,-1}','${JSON.stringify(photo)}',true)` }
  );

  // Or plain old SQL
  manager.query(
    `UPDATE "user" SET profile = jsonb_insert(profile,'{photos,-1}', $1, true) WHERE "firstName" = 'Timber'`,
    [photo]
  );

  console.log("Loading users from the database...");
  const users = await manager.find(User);
  console.log("Loaded users:");
  console.dir(users, { depth: 10 });
}

main();

// src/pages/Story.js

import React from 'react';
import CustomNavbar from '../components/Navbar';  // Importamos el componente Navbar
import styles from './Story.module.css';  // Importamos los estilos de la página Story

const Story = () => {
  return (
    <div className={styles.storyPage}>
      <CustomNavbar />  
      
      <div className={styles.storyContent}>
        <h1 className={styles.title}>Historia de Aramoth Legends</h1>
        <div className={styles.scrollableText}>  {/* Contenedor con scroll */}
          <p className={styles.storyText}>
          In the ancient lands of Elandor, where the whispering winds carried rumors of dragons and the skies still held echoes of elven songs, stood the great kingdom of Aramoth. A kingdom blessed with an abundance of gold, precious stones, and the ancient secrets of magic. Ruled for centuries by the house of Tharion, Aramoth was every monarch's dream. However, with the sudden death of King Valathor, leaving no legitimate heir, the doors of greed swung open, and the seven neighboring kingdoms, like hungry wolves, set their eyes on its riches.
          </p>
          <p className={styles.storyText}>
          The kingdoms surrounding Aramoth prepared for war. To the north, beneath snowy mountains, the Kingdom of Galdrin, home of the dwarves and their legendary forges, armed their warriors with swords as bright as the sun. The dwarves, experts in mining, knew that the riches of Aramoth could multiply their power in the world.
          </p>
          <p className={styles.storyText}>
          To the east, the Kingdom of Eldora, where elves dwelled in enchanted forests, watched cautiously. Their queen, Élenyrta, possessor of millennia-old wisdom, knew that the hidden magic in Aramoth was as dangerous as it was tempting. If it fell into the wrong hands, the balance of the world could crumble.
          </p>
          <p className={styles.storyText}>
          To the south, the scorching Kingdom of Balgardán, inhabited by human tribes and wild creatures, began to mobilize under the command of the feared Warlord Zoran. Balgardán, known for its cruelty on the battlefield, saw in Aramoth an opportunity to expand its dominion and forge an empire that would cover all the lands of Elandor.
          </p>
          <p className={styles.storyText}>
          From the west came the Kingdom of Velarian, whose dark mages had long coveted the power buried in the depths of Aramoth. Their leader, Archmage Serafoth, dreamed of unleashing ancient demons sealed beneath the catacombs of the fallen kingdom.
          </p>
          <p className={styles.storyText}>
          The other three kingdoms—Aldoria, Thalendra, and Norandor—though smaller, were no less ambitious. Aldoria, the most militarized kingdom, relied on its vast navy, while Thalendra, with its mysterious alchemists, sought secrets that could make them invincible. Norandor, the youngest of the kingdoms, attempted to use diplomacy to weave a web of alliances that would allow them to claim the throne of Aramoth without shedding blood.
          </p>
          <p className={styles.storyText}>
          But Aramoth was not entirely defenseless. Though without a king to guide them, the Guardians of Aramoth, an ancient order of knights, remained loyal to their oath to protect the lands of the kingdom. Led by Sir Dovoric and Sir Lunvador, the last of the great commanders, they knew that a storm of blood and steel would soon break out, and they would be the first line of defense.
          </p>
          <p className={styles.storyText}>
          The legend of Aramoth was beginning to be forged in the flames of the impending war. The balance of the world hung by a thread. One thing was certain: the kingdom that managed to seize Aramoth would not only control its riches but also the fate of all Elandor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;

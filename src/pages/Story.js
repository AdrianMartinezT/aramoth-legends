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
          En las tierras antiguas de Elandor, donde el susurro del viento traía rumores de dragones y los cielos aún guardaban ecos de cantos élficos, se erguía el gran reino de Aramoth. Un reino bendecido por la abundancia de oro, piedras preciosas y los antiguos secretos de la magia. Gobernado durante siglos por la casa de los Tharion, Aramoth era el sueño de todo monarca. Sin embargo, con la inesperada muerte del Rey Valathor, sin dejar heredero legítimo, las puertas de la codicia se abrieron, y los siete reinos vecinos, como lobos hambrientos, fijaron sus ojos en sus riquezas.
          </p>
          <p className={styles.storyText}>
          Los reinos que rodeaban a Aramoth se prepararon para la guerra. En el norte, bajo montañas nevadas, el Reino de Galdrin, hogar de los enanos y sus legendarias forjas, armaba a sus guerreros con espadas tan brillantes como el sol. Los enanos, expertos en la minería, sabían que las riquezas de Aramoth podrían multiplicar su poder en el mundo.
          </p>
          <p className={styles.storyText}>
          Al este, el Reino de Eldora, donde los elfos habitaban en bosques encantados, observaba con cautela. Su reina, Élenyrta, poseedora de una sabiduría milenaria, sabía que la magia oculta en Aramoth era tan peligrosa como tentadora. Si caía en manos equivocadas, todo el equilibrio del mundo podría desmoronarse.
          </p>
          <p className={styles.storyText}>
          Al sur, el caluroso Reino de Balgardán, habitado por tribus humanas y criaturas salvajes, comenzó a movilizarse bajo el mando del temido Señor de la Guerra, Zoran. Balgardán, conocido por su crueldad en el campo de batalla, veía en Aramoth una oportunidad para extender su dominio y forjar un imperio que cubriera todas las tierras de Elandor.
          </p>
          <p className={styles.storyText}>
          El oeste traía consigo el Reino de Velarian, cuyos magos oscuros habían anhelado por siglos el poder que yacía en las entrañas de Aramoth. Su líder, el Archimago Serafoth, soñaba con liberar antiguos demonios sellados bajo las catacumbas del reino caído.

          </p>
          <p className={styles.storyText}>
          Los otros tres reinos —Aldoria, Thalendra y Norandor—, aunque más pequeños, no eran menos ambiciosos. Aldoria, el reino más militarizado, confiaba en su vasta armada, mientras que Thalendra, con sus misteriosos alquimistas, buscaba secretos que los pudieran hacer invencibles. Norandor, el más joven de los reinos, intentaba usar la diplomacia para tejer una red de alianzas que le permitiera reclamar el trono de Aramoth sin derramar sangre.

          </p>
          <p className={styles.storyText}>
          Pero Aramoth no estaba completamente desprotegido. Aunque sin un rey que los guiara, los Guardianes de Aramoth, una antigua orden de caballeros, permanecían fieles a su juramento de proteger las tierras del reino. Liderados por Sir Dovoric y Sir Lunvador, los últimos de los grandes comandantes, sabían que pronto se desataría una tormenta de sangre y acero, y que ellos serían la primera línea de defensa.

          </p>
          <p className={styles.storyText}>
          La leyenda de Aramoth comenzaba a forjarse en las llamas de la guerra inminente. El equilibrio del mundo pendía de un hilo. Solo una cosa era segura: el reino que lograra hacerse con Aramoth no solo controlaría sus riquezas, sino el destino de toda Elandor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;

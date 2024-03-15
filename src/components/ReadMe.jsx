/**Na seção 13 Seção 13: A Look Behind The Scenes Of React &
 *  Optimization Techniques, é dado um código já pronto
 * que mostra um contador na tela com um botão de
 * increment e decrement acima há um prompt onde pode-se digitar
 * um número e depois se soma ou diminui um no componente
 * para o sistema verificar se o número é primo, a ideia é explicar como o React
 * renderiza os itens, para isso primeiro é mostrado
 * que o componente main renderiza o App que renderiza
 * os outros componentes que estão no seu return e
 * assim vai, criando uma árvore de renderização. Também
 * mostrou novamente o React Developer tools que é uma
 * extensão no Chrome para melhor visualizar como o React
 * processa as coisas, mostrando, por exemplo, quais
 * itens foram renderizados em determinada ação. */

/**A aula 206 explica sobre memo que explico melhor no material
 * complementar mas que, basicamente, é uma função para evitar
 * re-renderizações desnecessárias, no exemplo do curso
 * um input que não era afetado pelo contador, era renderizado
 * mesmo assim quando o contador era acionado, para 
 * evitar isso foi importada a função memo que é colocada
 * antes da função e a envolve. Assim, o React compara
 * os valores atuais e o anterior e se for o mesmo, ou seja,
 * se nada tiver mudado no componente, ele não é renderizado
 * No entanto, não deve ser usado desnecessariamente, deve
 * ser usado o mais alto possível na árvore DOM pois
 * os componentes abaixo não serão renderizados também, não
 * deve envolver componentes ondes os props vão mudar frequentemente
 * pois o memo também custa performance.
 */

/**Outro modo de melhorar a performance é ter uma distribuição mais inteligente
 * de componentes, fazendo com o que o App tenho o menos de lógica possível
 * e só rode o necessário em cada mudança. No exemplo do curso, havia toda
 * essa lógica abaixo no App e ela foi transferida para o componente
 * ConfigureCounter, assim foi preciso passar o prop onSet para passar o valor
 * Também foi importada essa função log que eu não sei se é algo padrão ou criado
 * pelo professor, mas que mostra o componente renderizado no console log. A lógica aqui
 * é mostrar que o componente ConfigureCount foi renderizado, ele não precisou 
 * renderizar também o App.
 */

import { useState } from "react";
import { log } from '../../log.js'

export default function ConfigureCounter ({onSet}) {
    log('<ConfigureCounter />', 1 );

    const [enteredNumber, setEnteredNumber] = useState(0);
    
  
    function handleChange(event) {
      setEnteredNumber(+event.target.value);
    }
  
    function handleSetClick() {
    onSet(enteredNumber);
    setEnteredNumber(0);
    }
    return (
        <section id="configure-counter">
          <h2>Set Counter</h2>
          <input type="number" onChange={handleChange} value={enteredNumber} />
          <button onClick={handleSetClick}>Set</button>
        </section>
    );

}

/**Já no App ficou assim */


function handleSetCount(newCount) {
    setChosenCount(newCount);
  }
  ...
<ConfigureCounter onSet={handleSetCount}/>


/**Na aula 208. Understanding the useCallback() Hook será explicado o useCallback
 * que explico melhor no material em anexo, mas que servirá nesse caso para evitar
 * a renderização desnecessária de funções aninhadas. No exemplo do curso é inserido
 * um memo no componente Button que só serve para envolver os botões, então, quando
 * o botão é acionado, renderiza outros componentes que não precisam ser renderizados
 * isso acontece porque um dos props recebidos de outro componente (Counter) tem
 * funções aninhadas. Para evitar isso será usado o useCallback para evitar a recriação
 * da função o que é às vezes necessário caso se tenha uma função como dependência
 */
/**Assim, dentro componente Counter essas duas funções abaixo são passadas por
 * props e estão sendo renderizadas desnecessariamente quando o button é acionado
 * pois foram envolvidas em um useCallback. Reparar que a função já é passada com o hook 
 * e assim, resguardada da mudança desnecessária, é retornada em uma variável de mesmo
 * nome o que garante a chamada correta mais abaixo, onde já era chamadas. Já o 
 * [] array criado deverá conter props ou states ou context values que possam mudar
 * No caso, como só há o setCounter função que o React já garante que não será mudada
 * não é preciso passar nada
 */

const handleDecrement = useCallback( function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }, []);

  const handleIncrement = useCallback(function handleIncrement() {
    setCounter((prevCounter) => prevCounter + 1);
  }, []);

  /**Na aula 209 é explicada o hook useMemo que evita a rerendirazação de funções
   * normais dentro do componente e não do componente, como o memo. No exemplo
   * da aula foi mostrado que a função isPrime, que é a função que verifica
   * se o número é primo, é chamada toda vez que o componente renderiza
   * e não somente quando o botão set é pressionado, gastando processamento
   * desnecessariamente. Assim, foi ela foi guardada dentro do hook conforme
   * sintaxe abaixo, sendo o valor entre [] o que deve ser monitorado
   * para caso de mudança*/
  
  
  const initialCountIsPrime = useMemo(() => isPrime(initialCount), [initialCount]);


  /**Aula 210 fala sobre virtua DOM que é a árvore de componentes virtual
   * que o REACT cria para fins de otimização do UI e para comparar e mudar no
   * REAL DOM apenas o que foi atualizado e não o código inteiro.
   */
  /**A aula 211 demonstrou que cada componente controla
   * o seu próprio estado, por exempo, o componente
   * do aplicativo foi duplicado e cada um ficou com números
   * diferentes, no entanto, também mostrou que o REACT controla
   * o estado e a posição, assim, para fins de exemplo,
   * foi adicionado um componente para acrescentar um -1 ou 1
   * abaixo do componente cada vez que fosse clicado, e se se
   * marcar um desses números e clicar de novo, o REACT continua
   * marcando o lugar e não segue o número prévio. Para evitar
   * isso, ou seja, se ratrear o componente correto
   * é importante usar uma key sempre, no exemplo do curso
   * foi usada um math.random para gerar um número aleatório, 
   * na prática, vai ser algo ligado ao banco de dados. Já a aula
   * 212 complementa que usar a key, que não seja key={index}, evita
   * que toda a lista de itens seja renderizada, mas apenas o 
   * novo item que está sendo adicionado, já que não se mudará
   * todas as keys, de todos os itens.
   * 
   */
/**Na aula 213 é ensinado um padrão para quando se precisa
 * resetar o valor de um componente, com base no estado de outro.
 * No exemplo do curso, há um input onde se insere um número
 * e depois esse número deve ser mostrado no componente abaixo,
 * ou seja, quando se mudar o estado do componente de cima,
 * isso deve se refletir no outro. Para isso, se poderia 
 * usar useEffect, o que funciona, mas é mais complexo ou usar
 * o componente como uma key. Assim, como no exemplo abaixo
 * o valor escolhido, ou seja, o valor inicial do componente
 * anterior serve como key para o de baixo e se ele for
 * modificado, o componente de baixo vai jogar fora o valor
 * anterior e usar o de cima, sem necessidade de re rendizar
 * tudo de novo. Assim, esse é um 'truque" para quando muda o estado
 * em um componente que leva a renderização de componente filho
 * usando esse novo valor. Lembrando que cada key só pode
 * ser usado em um componente.
 */
  <Counter key={chosenCount} initialCount={chosenCount} />

  /**A aula 216 explica um conceito que já havia citado antes, que o REACT não atualiza
   * imediatamente o estado, assim, a função abaixo, por exemplo, daria o resultado 1,
   * mesmo que se informasse outro número no input, pois o estado inicial na primeira
   * renderização é 0, portanto, 0 + 1.
  */

  const [chosenCount, setChosenCount] = useState(0);

function handleSetCount(newCount) {
  setChosenCount(newCount);
  setChosenCount(chosenCount + 1);
}

/**para evitar isso, usa-se a sintaxe abaixo, que garante que as funções serão
 * executadas na ordem correta e o estado anterior será preservado, assim, 
 * se digita-se dez no input, por exemplo, ele retornaria 11 e não 01 como no anterior.
 *Isso acontece porque o REACT sobe os estados dentro de uma mesmo função em lote (batch)*/

function handleSetCount(newCount) {
  setChosenCount(newCount);
  setChosenCount((prevChosenCount) => prevChosenCount + 1);
}
/**A aula 215 ensina million.js que é um biblioteca que 
 * otimiza a performance do React, tornando-o 70% mais rápido.
 * A forma de instalação e configuração estão no vídeo e no site.
 */
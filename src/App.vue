<template>
  <div class="App">
    <div class="GameField">
      <div
        class="GameField__card"
        v-for="(card, ind) in gameCards"
        :key="ind"
        @click="clickCard(card, ind)"
        :class="{
          showed: getSelectedCardIndexes().includes(ind),
          founded: this.foundedNumbers.includes(ind),
          highlight_style: this.highlightedCards?.includes(ind),
          game_not_started: !this.isGameRunning,
        }"
      >
        {{ card }}
      </div>
    </div>
    <div class="Info">
      <div class="GameTitle">Найди три одинаковые цифры</div>
      <div class="MistakesCounter">Промахи: {{mistakesCount}}</div>
      <button 
        class="StartGameBtn"
        @click="startGame">
          {{isGameFinished ? 'Играть заново' : 'Начать игру'}}
      </button>
    </div>
  </div>
</template>

<script>
import { getGameField } from "@/helpers/shuffle";
export default {
  name: "App",
  data() {
    return {
      isGameRunning: false,
      isGameFinished: false,
      gameCards: new Array(30),
      highlightedCards: null,
      foundedNumbers: [],
      selectedCards: {
        firstCard: null,
        secondCard: null,
        thirdCard: null,
      },
      mistakesCount: 0,
      timeoutId: null,
    };
  },
  methods: {
    startGame(){
      if(this.isGameRunning && !this.isGameFinished){
        return;
      }
      this.gameCards = getGameField();
      this.foundedNumbers = [];
      this.isGameRunning = true;
      this.isGameFinished = false;
    },
    getSelectedCardIndexes(){
      return Object.values(this.selectedCards).map(i => i?.index);
    },
    resetSelectedCards(){
      for(let prop in this.selectedCards){
        this.selectedCards[prop] = null;
      }
    },
    clickCard(value, index) {
      if(this.highlightedCards){
        this.resetSelectedCards();
        this.stopHighlightingCards();
        clearTimeout(this.timeoutId);
      }
      this.selectCard(value, index);
    },
    selectCard(value, index){
      const cardIndexes = Object.values(this.selectedCards)
        .filter(i => i !== null)
        .map(i => i.index);
      for(const prop in this.selectedCards){
        if(!this.selectedCards[prop]){
          if(!cardIndexes.includes(index)){
            this.selectedCards[prop] = {value, index};
            break;
          }
        }
      }
    },
    highlightCards(...cards){
      this.highlightedCards = cards;
    },
    stopHighlightingCards(){
      this.highlightedCards = null;
    },
    resetAllAfterSomeTime(){
      this.timeoutId = setTimeout(() => {
        this.stopHighlightingCards();
        this.resetSelectedCards();
      }, 1500);
    },
    incrementMistakesCount(){
      this.mistakesCount++;
    },
    gamerMistaked(){
      this.highlightCards(...this.getSelectedCardIndexes());
      this.incrementMistakesCount();
      this.resetAllAfterSomeTime();
    }
  },
  watch: {
    selectedCards: {
      handler(){
        if(this.selectedCards.thirdCard){
          if(this.selectedCards.firstCard.value !== this.selectedCards.thirdCard.value){
            this.gamerMistaked();
          }
          else {
            this.foundedNumbers.push(...this.getSelectedCardIndexes());
            this.resetSelectedCards();
          }
        }
        else if(this.selectedCards.secondCard){
          if(this.selectedCards.firstCard.value !== this.selectedCards.secondCard.value){
            this.gamerMistaked();
          }
        }
      },
      deep: true,
    },
    foundedNumbers: {
      handler(){
        if(this.foundedNumbers.length === 30){
          this.isGameFinished = true;
        }
      },
      deep: true,
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: black;
}
.App {
  padding: 20px;
  display: flex;
}
.Info {
  display: flex;
  flex-direction: column;
  color: whitesmoke;
  margin-left: 100px;
}
.GameTitle {
  font-size: 40px;
  margin-bottom: 50px;
}
.MistakesCounter {
  color: red;
  font-size: 30px;
  flex-grow: 1;
}
.StartGameBtn {
  justify-content: flex-end;
  color: whitesmoke;
  font-size: 30px;
  background-color: green;
  padding: 10px;
  cursor: pointer;
  align-self: flex-start;
}
.GameField {
  display: grid;
  grid-template-columns: repeat(6, 100px);
  grid-template-rows: repeat(5, 100px);
  gap: 10px;
}
.GameField__card {
  background-color: aqua;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0;
}
.GameField__card:hover {
  background-color: aquamarine;
  transition-duration: 0.3s;
}
.showed {
  font-size: 30px;
  background-color: yellow;
}
.showed:hover {
  background-color: yellow;
}
.founded {
  font-size: 30px;
  background-color: green;
  pointer-events: none;
}
.founded:hover {
  background-color: green;
}
.highlight_style {
  animation-name: highlight;
  animation-duration: 0.3s;
  animation-iteration-count: 5;
}
.game_not_started {
  background-color: gray;
  pointer-events: none;
}
@keyframes highlight {
  0% {
    background-color: red;
  }
  50% {
    background-color: red;
  }
  100% {
    background-color: aqua;
  }
}
</style>

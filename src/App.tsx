import styled from 'styled-components'
import { Stage, OrbitConfig } from './Stage'

const Wrapper = styled.div`
  position: relative;
  max-width: 800px;
  aspect-ratio: 1 / 1;
  width: 100%;
`

function App() {

  const orbits: OrbitConfig[] = [
    { rotation: [22.5, 0, 0], labels: [
      { label: "Microsoft", pos: 0.5, color: "#FFC1DD" },
      { label: "Rewind", pos: 0.1, color: "#A7B7FF" },
    ]},
    { rotation: [0, 120, 0], labels: [
      { label: "Rabbit", pos: 0.2, color: "#BBFFF7" },
      { label: "Apple", pos: 0.8, color: "#BDA0FF" },
    ]},
    { rotation: [0, 240, 0], labels: [
      { label: "World Coin", pos: 0.4, color: "#AAEBFF" },
    ]},
    { rotation: [90, 0, 0], labels: [
      { label: "Oura", pos: 0.6, color: "#FAC1FF" },
      { label: "Meta", pos: 0.9, color: "#C977FF" },
    ]},
  ]
  return (
    <Wrapper>
      <Stage orbits={orbits}/>
    </Wrapper>
  )
}

export default App

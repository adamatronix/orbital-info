import styled from 'styled-components'
import { Stage } from './Stage'

const Wrapper = styled.div`
  position: relative;
  max-width: 800px;
  aspect-ratio: 1 / 1;
  width: 100%;
`

function App() {

  return (
    <Wrapper>
      <Stage />
    </Wrapper>
  )
}

export default App

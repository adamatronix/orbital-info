import styled from 'styled-components'
import { Stage } from './Stage'

const Wrapper = styled.div`
  position: relative;
  width: 800px;
  height: 800px;
`

function App() {

  return (
    <Wrapper>
      <Stage />
    </Wrapper>
  )
}

export default App

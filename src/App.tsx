import styled from 'styled-components'
import { Stage } from './Stage'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`

function App() {

  return (
    <Wrapper>
      <Stage />
    </Wrapper>
  )
}

export default App

import Content from './components/content/content'
import LanguageList from './components/language_list/language_list'
import OptionList from './components/option_list/option_list'

export default function Home() {
  const isRevert = false
  return (
    <div>
      <OptionList isRevert={isRevert} />
      <LanguageList isRevert={isRevert} />
      <Content isRevert={isRevert} />
    </div>
  )
  // return <pose-viewer></pose-viewer>
  // const [text, setText] = useState('Hello')
  // const [value] = useDebounce(text, 1000)

  // return (
  //   <div>
  //     <input
  //       defaultValue=''
  //       onChange={e => {
  //         setText(e.target.value)
  //       }}
  //     />
  //     <p>Actual value: {text}</p>
  //     <p>Debounce value: {value}</p>
  //   </div>
  // )
}

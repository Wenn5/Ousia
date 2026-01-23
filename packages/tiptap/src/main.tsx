import { createRoot } from "react-dom/client"
import { SimpleEditor } from "@ousia/tiptap/components/tiptap-templates/simple/simple-editor"

const App = () => <SimpleEditor />

createRoot(document.getElementById("app")!).render(<App />)

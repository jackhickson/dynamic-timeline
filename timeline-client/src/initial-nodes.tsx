import  {Node} from 'reactflow';

export const nodes: Array<Node> = [
  {
    id: '1',
    type: 'custom',
    data: {
      label: "here",
      plotInfo: {
        chapterRange: {startChapter: 1},
        characters: ["Erin"],
        description: "here",
        location: "here",
      }
    },
    position: { x: 250, y: 0 }
  },
  {
    id: '2',
    type: 'input',
    data: {
      label: 'plotPoint'
    },
    position: { x: 100, y: 100 }
  }
]

export const edges = [
  { id: 'e1-3', source: '2', target: '1' }
]
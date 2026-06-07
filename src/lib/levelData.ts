export const MOCK_LEVEL_DATA = {
  monster_name: "链表魔龙",
  total_steps: 3,
  steps: [
    {
      step_id: 1,
      description: "链表魔龙当前头节点为1，prev=null，curr=1，next=2。请选择正确的操作开始反转。",
      visual_state: {
        reversed: [],
        remaining: [1, 2, 3, 4, 5],
        prev: null,
        curr: 1,
        next: 2
      },
      question: "第一步应该做什么？",
      options: [
        {
          id: "A",
          text: "curr.next = prev",
          is_correct: true,
          damage: 20,
          feedback: "正确！你成功将节点1指向null，并移动了指针。"
        },
        {
          id: "B",
          text: "prev.next = curr",
          is_correct: false,
          damage: 0,
          feedback: "错误！prev为null，无法执行此操作。记住，反转链表时初始prev为null。"
        }
      ]
    },
    {
      step_id: 2,
      description: "干得漂亮！现在prev=1，curr=2，next=3。已反转部分[1]，剩余[2,3,4,5]。",
      visual_state: {
        reversed: [1],
        remaining: [2, 3, 4, 5],
        prev: 1,
        curr: 2,
        next: 3
      },
      question: "下一步该怎么做？",
      options: [
        {
          id: "A",
          text: "curr.next = prev",
          is_correct: true,
          damage: 20,
          feedback: "正确！节点2的next指向1，指针移动完成。"
        },
        {
          id: "B",
          text: "prev.next = curr",
          is_correct: false,
          damage: 0,
          feedback: "错误！prev.next已经是null，再次指向curr会导致循环。"
        }
      ]
    },
    {
      step_id: 3,
      description: "很好！现在prev=2，curr=3，next=4。已反转部分[2,1]，剩余[3,4,5]。",
      visual_state: {
        reversed: [2, 1],
        remaining: [3, 4, 5],
        prev: 2,
        curr: 3,
        next: 4
      },
      question: "最后一步该怎么做？",
      options: [
        {
          id: "A",
          text: "curr.next = prev",
          is_correct: true,
          damage: 20,
          feedback: "正确！节点3的next指向2，继续移动指针。战斗胜利！"
        },
        {
          id: "B",
          text: "curr.next = next",
          is_correct: false,
          damage: 0,
          feedback: "错误！保持原顺序。"
        }
      ]
    }
  ]
};

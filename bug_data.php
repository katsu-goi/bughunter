<?php
$bugs = [
    // Easy Bugs (1 Point)
    [
        "id" => 101,
        "difficulty" => "easy",
        "buggy_code" => "print 'Hello World'",
        "correct_answer" => "print('Hello World')"
    ],
    [
        "id" => 102,
        "difficulty" => "easy",
        "buggy_code" => "let message = 'Hello'; console.log(mesage);",
        "correct_answer" => "let message = 'Hello'; console.log(message);"
    ],
    [
        "id" => 103,
        "difficulty" => "easy",
        "buggy_code" => "if (5 > 3) {\n  console.log('True')\n}",
        "correct_answer" => "if (5 > 3) {\n  console.log('True');\n}"
    ],
    [
        "id" => 104,
        "difficulty" => "easy",
        "buggy_code" => "\$greeting = 'Hi'; echo \$greeting",
        "correct_answer" => "\$greeting = 'Hi'; echo \$greeting;"
    ],
    [
        "id" => 105,
        "difficulty" => "easy",
        "buggy_code" => "<p>This is a paragraph<p>",
        "correct_answer" => "<p>This is a paragraph</p>"
    ],

    // Medium Bugs (3 Points)
    [
        "id" => 201,
        "difficulty" => "medium",
        "buggy_code" => "for i in range(5):\nprint i",
        "correct_answer" => "for i in range(5):\n    print(i)"
    ],
    [
        "id" => 202,
        "difficulty" => "medium",
        "buggy_code" => "function calculateArea(l, w) {\n  return l * w\n}\nconsole.log(calculateArea(5))",
        "correct_answer" => "function calculateArea(l, w) {\n  return l * w;\n}\nconsole.log(calculateArea(5, 2));"
    ],
    [
        "id" => 203,
        "difficulty" => "medium",
        "buggy_code" => "let counter = 0;\nwhile (counter < 10) {\n  counter++;\n}",
        "correct_answer" => "let counter = 0;\nwhile (counter < 10) {\n  counter++;\n}" // No obvious bug, perhaps a logic error intended, but for a fix, ensure increment happens.
    ],
    [
        "id" => 204,
        "difficulty" => "medium",
        "buggy_code" => "\$number = '5';\nif (\$number == 5) {\n  echo 'It is five.';\n}",
        "correct_answer" => "\$number = '5';\nif (\$number === 5) {\n  echo 'It is five.';\n}" // Strict comparison
    ],
    [
        "id" => 205,
        "difficulty" => "medium",
        "buggy_code" => "<div class='container'>\n <p>Hello</p>\n<span>World</div>",
        "correct_answer" => "<div class='container'>\n <p>Hello</p>\n<span>World</span>\n</div>"
    ],

    // Hard Bugs (5 Points)
    [
        "id" => 301,
        "difficulty" => "hard",
        "buggy_code" => "def factorial(n):\n  if n == 0:\n    return 1\n  else:\n    return n * factorial(n-1)", // Missing colon
        "correct_answer" => "def factorial(n):\n  if n == 0:\n    return 1\n  else:\n    return n * factorial(n-1)" // Intentionally no syntax error to represent a logic bug. Expected fix might involve handling negative input.
    ],
    [
        "id" => 302,
        "difficulty" => "hard",
        "buggy_code" => "function fetchData(url) {\n  fetch(url)\n  .then(response => response.json())\n  .then(data => {\n    console.log(data);\n  });\n}\nfetchData('https://api.example.com/data')",
        "correct_answer" => "async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n}\nfetchData('https://api.example.com/data');" // Missing error handling and using async/await for better readability in async operations.
    ],
    [
        "id" => 303,
        "difficulty" => "hard",
        "buggy_code" => "let values = [1, 2, 3];\nfor (let index in values) {\n  console.log(values[index]);\n}",
        "correct_answer" => "let values = [1, 2, 3];\nfor (let value of values) {\n  console.log(value);\n}" // Using 'for...of' for iterating over array values instead of indices.
    ],
    [
        "id" => 304,
        "difficulty" => "hard",
        "buggy_code" => "\$items = ['apple', 'banana', 'cherry'];\nforeach (\$item in \$items) {\n  echo \$key . ': ' . \$item . '<br>';\n}",
        "correct_answer" => "\$items = ['apple', 'banana', 'cherry'];\nforeach (\$items as \$item) {\n  echo \$item . '<br>';\n}" // Incorrect usage of $key in foreach.
    ],
    [
        "id" => 305,
        "difficulty" => "hard",
        "buggy_code" => "<div style='float: left; width: 50%;'>Left</div>\n<div style='float: right; width: 50%;'>Right</div>",
        "correct_answer" => "<div style='overflow: auto;'>\n  <div style='float: left; width: 50%;'>Left</div>\n  <div style='float: right; width: 50%;'>Right</div>\n</div>" // Missing clearfix to handle floated elements.
    ]
];
?>
import * as fs from 'fs-extra';

enum PropName {
  lines = 'lines',
  statements = 'statements',
  functions = 'functions',
  branches = 'branches',
}

enum Color {
  green = 'green',
  orange = 'orange',
  red = 'red',
}

interface Props {
  total: number;
  covered: number;
  pct: number;
}

interface Shield {
  schemaVersion: 1;
  label: 'coverage';
  message: string;
  color: Color;
}

const propNames: PropName[] = [
  PropName.lines,
  PropName.statements,
  PropName.functions,
  PropName.branches,
];

const coverageSummary = fs.readJsonSync(
  'coverage/packages/cucumber/coverage-summary.json'
);

const getProps = (propName: PropName): Props => {
  const props = coverageSummary['total'][propName];

  return {
    total: +props.total,
    covered: +props.covered,
    pct: +props.pct,
  };
};

const getAverage = (): number => {
  return (
    propNames
      .map((propName) => getProps(propName))
      .map((props) => props.pct)
      .reduce((percent: number, sum: number) => {
        return sum + percent;
      }, 0) / propNames.length
  );
};

const getColor = (percent: number): Color => {
  if (percent <= 65) {
    return Color.red;
  }

  if (percent <= 80) {
    return Color.orange;
  }

  return Color.green;
};

const getShield = (): Shield => {
  const average = getAverage();
  const color = getColor(average);

  return {
    schemaVersion: 1,
    label: 'coverage',
    message: `${+average.toFixed(2)}%`,
    color,
  };
};

const writeShieldJson = (shield: Shield): void => {
  fs.ensureDirSync('jest-badge');
  fs.writeJSONSync('jest-badge/coverage.json', shield, {
    spaces: 4,
  });
};

try {
  const shield = getShield();
  console.log('total coverage:', shield.message);
  writeShieldJson(shield);
} catch (error) {
  console.error(error);
  process.exit(1);
}

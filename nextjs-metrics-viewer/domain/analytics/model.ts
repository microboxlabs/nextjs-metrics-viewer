type AnalyticsModelProps = {
  id?: string;
  category: string;
  value: number;
  date: Date;
};

class AnalyticsModel {
  private readonly __id?: string;
  private readonly __category: string;
  private readonly __value: number;
  private readonly __date: Date;

  constructor(props: AnalyticsModelProps) {
    this.__id = props.id;
    this.__category = props.category;
    this.__value = props.value;
    this.__date = props.date;
  }

  public get props(): AnalyticsModelProps {
    return {
      id: this.__id,
      category: this.__category,
      value: this.__value,
      date: this.__date,
    };
  }
}

export { AnalyticsModel };

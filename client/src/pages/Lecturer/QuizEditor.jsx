import { useState, useEffect } from 'react';
import {
  Form, Input, InputNumber, Select, Button, Card, Space, Divider, 
  message, DatePicker, Spin, Radio, Switch, Tooltip
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const { TextArea } = Input;

const QuizEditor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/quizzes/${id}`);
      const quiz = data.quiz;
      form.setFieldsValue({
        title: quiz.title,
        description: quiz.description,
        course: quiz.course,
        duration: quiz.duration,
        passingPercentage: quiz.passingPercentage,
        startDate: quiz.startDate ? dayjs(quiz.startDate) : null,
        endDate: quiz.endDate ? dayjs(quiz.endDate) : null,
        pricingType: quiz.pricingType || 'free',
        price: quiz.price || 0,
        maxAttempts: quiz.maxAttempts || 1,
        shuffleQuestions: quiz.shuffleQuestions !== undefined ? quiz.shuffleQuestions : true,
        questions: quiz.questions.map(q => ({
          questionText: q.questionText,
          questionType: q.questionType,
          marks: q.marks,
          correctAnswer: q.correctAnswer || '',
          options: q.options?.map(o => ({
            text: o.text,
            isCorrect: o.isCorrect
          })) || []
        }))
      });
    } catch (error) {
      message.error('Failed to load quiz');
      navigate('/lecturer/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        questions: values.questions?.map(q => {
          const question = {
            questionText: q.questionText,
            questionType: q.questionType,
            marks: q.marks || 1,
          };

          if (q.questionType === 'mcq') {
            question.options = q.options || [];
          } else if (q.questionType === 'true-false') {
            question.options = [
              { text: 'True', isCorrect: q.correctAnswer === 'true' },
              { text: 'False', isCorrect: q.correctAnswer === 'false' }
            ];
          } else if (q.questionType === 'short-answer') {
            question.correctAnswer = q.correctAnswer || '';
          }

          return question;
        }) || []
      };

      if (isEditing) {
        await api.put(`/quizzes/${id}`, payload);
        message.success('Quiz updated successfully!');
      } else {
        await api.post('/quizzes', payload);
        message.success('Quiz created successfully!');
      }
      navigate('/lecturer/quizzes');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/lecturer/quizzes')} />
          <div>
            <h2 className="section-title">{isEditing ? t('edit_quiz') : t('create_quiz')}</h2>
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large"
        initialValues={{ duration: 30, passingPercentage: 50, pricingType: 'free', price: 0, maxAttempts: 1, shuffleQuestions: true, questions: [], category: 'general', lessonReference: '' }}>

        {/* Quiz Details Card */}
        <Card title="📋 Quiz Details" style={{ marginBottom: 20, borderRadius: 12 }}>
          <Form.Item name="title" label={t('quiz_title')}
            rules={[{ required: true, message: 'Please enter quiz title' }]}>
            <Input placeholder="e.g., JavaScript Fundamentals" />
          </Form.Item>

          <Form.Item name="description" label={t('quiz_description')}>
            <TextArea rows={3} placeholder="Brief description of the quiz..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item name="course" label={t('course')}>
              <Input placeholder="e.g., CS101" />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="general">General</Select.Option>
                <Select.Option value="mid_exam">Mid Exam</Select.Option>
                <Select.Option value="final_exam">Final Exam</Select.Option>
                <Select.Option value="lesson_based">Lesson Based</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
            >
              {({ getFieldValue }) =>
                getFieldValue('category') === 'lesson_based' ? (
                  <Form.Item name="lessonReference" label="Lesson Reference" rules={[{ required: true, message: 'Please enter a lesson reference' }]}>
                    <Input placeholder="e.g. Unit 3 - Algebra" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item name="duration" label={t('duration_minutes')}
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={1} max={300} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="passingPercentage" label={t('passing_percentage')}>
              <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="startDate" label={t('start_date')}>
              <DatePicker style={{ width: '100%' }} showTime />
            </Form.Item>
            <Form.Item name="endDate" label={t('end_date')}>
              <DatePicker style={{ width: '100%' }} showTime />
            </Form.Item>
          </div>
        </Card>

        {/* Pricing & Attempt Settings Card */}
        <Card title="💰 Pricing & Attempts" style={{ marginBottom: 20, borderRadius: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item name="pricingType" label="Quiz Type">
              <Select>
                <Select.Option value="free">🆓 Free</Select.Option>
                <Select.Option value="paid">💳 Paid</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.pricingType !== cur.pricingType}>
              {({ getFieldValue }) => (
                getFieldValue('pricingType') === 'paid' ? (
                  <Form.Item name="price" label="Price (LKR)"
                    rules={[{ required: true, message: 'Enter price' }]}>
                    <InputNumber min={1} max={100000} style={{ width: '100%' }} addonBefore="LKR" />
                  </Form.Item>
                ) : null
              )}
            </Form.Item>

            <Form.Item name="maxAttempts" label="Max Attempts"
              tooltip="How many times a student can attempt this quiz">
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="shuffleQuestions" label="Shuffle Questions" valuePropName="checked"
              tooltip="When enabled, questions and MCQ options are randomized for each student and attempt">
              <Switch
                checkedChildren={<><SwapOutlined /> ON</>}
                unCheckedChildren="OFF"
                style={{ minWidth: 70 }}
              />
            </Form.Item>
          </div>
        </Card>

        {/* Questions */}
        <Card title="❓ Questions" style={{ marginBottom: 20, borderRadius: 12 }}>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card 
                    key={key} 
                    size="small"
                    title={`Question ${index + 1}`}
                    extra={
                      <Button type="text" danger icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}>
                        Remove
                      </Button>
                    }
                    style={{ marginBottom: 16, background: 'var(--bg-primary)', borderRadius: 10 }}
                  >
                    <Form.Item {...restField} name={[name, 'questionText']} label={t('question_text')}
                      rules={[{ required: true, message: 'Required' }]}>
                      <TextArea rows={2} placeholder="Enter question..." />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item {...restField} name={[name, 'questionType']} label={t('question_type')}
                        rules={[{ required: true, message: 'Required' }]}>
                        <Select placeholder="Select type">
                          <Select.Option value="mcq">{t('mcq')}</Select.Option>
                          <Select.Option value="true-false">{t('true_false')}</Select.Option>
                          <Select.Option value="short-answer">{t('short_answer')}</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item {...restField} name={[name, 'marks']} label={t('marks')}
                        rules={[{ required: true }]}>
                        <InputNumber min={1} max={100} style={{ width: '100%' }} />
                      </Form.Item>
                    </div>

                    {/* Dynamic rendering based on question type */}
                    <Form.Item noStyle shouldUpdate={(prev, cur) => {
                      const prevType = prev.questions?.[name]?.questionType;
                      const curType = cur.questions?.[name]?.questionType;
                      return prevType !== curType;
                    }}>
                      {({ getFieldValue }) => {
                        const type = getFieldValue(['questions', name, 'questionType']);

                        if (type === 'mcq') {
                          return (
                            <div>
                              <Form.Item {...restField} name={[name, 'isMultiSelect']} valuePropName="checked" style={{ marginBottom: 12 }}>
                                <Switch checkedChildren={<><CheckOutlined /> Multi Select</>} unCheckedChildren="Single Select" style={{ marginRight: 8 }} />
                                <span style={{ color: 'var(--text-secondary)' }}>Allow Multiple Correct Answers?</span>
                              </Form.Item>
                              <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>{t('options')}</label>
                              <Form.List name={[name, 'options']}>
                                {(optFields, { add: addOpt, remove: removeOpt }) => (
                                  <>
                                    {optFields.map(({ key: optKey, name: optName, ...optRest }) => (
                                      <div key={optKey} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                        <Form.Item {...optRest} name={[optName, 'text']} noStyle
                                          rules={[{ required: true, message: 'Enter option text' }]}>
                                          <Input placeholder={`Option ${optName + 1}`} style={{ flex: 1 }} />
                                        </Form.Item>
                                        <Form.Item {...optRest} name={[optName, 'isCorrect']} valuePropName="checked" noStyle>
                                          <Switch checkedChildren={<CheckOutlined />} unCheckedChildren="✗"
                                            style={{ minWidth: 60 }} />
                                        </Form.Item>
                                        <Button type="text" danger icon={<MinusCircleOutlined />}
                                          onClick={() => removeOpt(optName)} />
                                      </div>
                                    ))}
                                    <Button type="dashed" onClick={() => addOpt({ text: '', isCorrect: false })}
                                      icon={<PlusOutlined />} style={{ width: '100%' }}>
                                      Add Option
                                    </Button>
                                  </>
                                )}
                              </Form.List>
                            </div>
                          );
                        }

                        if (type === 'true-false') {
                          return (
                            <Form.Item {...restField} name={[name, 'correctAnswer']} label={t('correct_answer')}
                              rules={[{ required: true, message: 'Select correct answer' }]}>
                              <Radio.Group>
                                <Radio value="true">True</Radio>
                                <Radio value="false">False</Radio>
                              </Radio.Group>
                            </Form.Item>
                          );
                        }

                        if (type === 'short-answer') {
                          return (
                            <Form.Item {...restField} name={[name, 'correctAnswer']} label={t('correct_answer')}
                              rules={[{ required: true, message: 'Enter correct answer' }]}>
                              <Input placeholder="Enter the correct answer..." />
                            </Form.Item>
                          );
                        }

                        return null;
                      }}
                    </Form.Item>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add({ questionType: 'mcq', marks: 1, options: [
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                ] })}
                  block icon={<PlusOutlined />} size="large"
                  style={{ height: 50, borderRadius: 10 }}>
                  {t('add_question')}
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 40 }}>
          <Button onClick={() => navigate('/lecturer/quizzes')} size="large">
            {t('cancel')}
          </Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} size="large"
            style={{ fontWeight: 600 }}>
            {isEditing ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default QuizEditor;

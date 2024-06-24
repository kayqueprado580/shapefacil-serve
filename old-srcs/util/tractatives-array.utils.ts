import { BadRequestException } from '@nestjs/common';

export function appendStudent(
  newStudent: string[] | JSON | string,
  baseStudent: string[],
): string {
  if (newStudent) {
    let novosAlunos: string[] = [];
    if (typeof newStudent === 'string') {
      novosAlunos = newStudent.split(',');
    } else if (Array.isArray(newStudent)) {
      novosAlunos = newStudent;
    } else {
      throw new BadRequestException('Formato inválido!');
    }
    novosAlunos = novosAlunos.filter((aluno) => !baseStudent.includes(aluno));
    baseStudent.push(...novosAlunos);
  }
  const alunosUnicos = [...new Set(baseStudent)];
  return alunosUnicos.join(',');
}

export function removeStudent(
  newStudent: string[] | JSON | string,
  baseStudent: string[],
): string {
  if (typeof newStudent === 'string') {
    baseStudent = baseStudent.filter((aluno) => aluno !== newStudent);
  } else if (Array.isArray(newStudent)) {
    newStudent.forEach((student) => {
      baseStudent = baseStudent.filter((aluno) => aluno !== student);
    });
  } else {
    throw new Error('Formato inválido!');
  }

  return baseStudent.join(',');
}

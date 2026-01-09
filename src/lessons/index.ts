import { Lesson } from '@/lib/types'
import { leanBasicsLesson } from './01-lean-basics'
import { logicProofsLesson } from './02-logic-proofs'
import { naturalNumbersLesson } from './03-natural-numbers'
import { polynomialsLesson } from './04-polynomials'
import { ellipticCurvesLesson } from './05-elliptic-curves'
import { diffieHellmanLesson } from './06-diffie-hellman'
import { lagrangeLesson } from './07-lagrange'
import { latticeLesson } from './08-lattice'
import { rlweLesson } from './09-rlwe'
import { sumcheckLesson } from './10-sumcheck'

export const lessons: Lesson[] = [
  leanBasicsLesson,
  logicProofsLesson,
  naturalNumbersLesson,
  polynomialsLesson,
  ellipticCurvesLesson,
  diffieHellmanLesson,
  lagrangeLesson,
  latticeLesson,
  rlweLesson,
  sumcheckLesson,
].sort((a, b) => a.order - b.order)

export {
  leanBasicsLesson,
  logicProofsLesson,
  naturalNumbersLesson,
  polynomialsLesson,
  ellipticCurvesLesson,
  diffieHellmanLesson,
  lagrangeLesson,
  latticeLesson,
  rlweLesson,
  sumcheckLesson,
}

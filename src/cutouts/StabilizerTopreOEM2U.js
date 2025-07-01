import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// Basic MX stabilizer cutout

export class StabilizerTopreOEM2U extends CutoutGenerator {

    generate(key, generatorOptions) {

        let width
        let height
        let A
        let B
        let C
        let D
        let E
        let F
        let G
        let H
        let K
        let L
        var cutouts

        let keyWidth = key.width;
        let keyHeight = key.height;

        if (((keyWidth >= 2) && (keyWidth <= 3)) || ((keyHeight >= 2) && (keyHeight <= 3))) {
            width = new Decimal("32")
            height = new Decimal("14")

            const plusHalfWidth = width.dividedBy(new Decimal("2"))
            const minsHalfWidth = width.dividedBy(new Decimal("-2"))
            const plusHalfHeight = height.dividedBy(new Decimal("2"))
            const minsHalfHeight = height.dividedBy(new Decimal("-2"))

            A = [minsHalfWidth.toNumber(), plusHalfHeight.toNumber()]
            B = [plusHalfWidth.toNumber(), plusHalfHeight.toNumber()]
            C = [minsHalfWidth.toNumber(), minsHalfHeight.plus(1.732).toNumber()]
            D = [plusHalfWidth.toNumber(), minsHalfHeight.plus(1.732).toNumber()]
            E = [minsHalfWidth.plus(3).toNumber(), minsHalfHeight.toNumber()]
            F = [plusHalfWidth.minus(3).toNumber(), minsHalfHeight.toNumber()]

            K = [plusHalfWidth.plus(0.4).toNumber(), minsHalfHeight.minus(0.2).toNumber()]
            L = [minsHalfWidth.minus(0.4).toNumber(), minsHalfHeight.minus(0.2).toNumber()]

            cutouts = {
                paths: {
                    lineTop: new makerjs.paths.Line(A, B),
                    lineBottom: new makerjs.paths.Line(E, F),
                    lineLeft: new makerjs.paths.Line(A, C),
                    lineRight: new makerjs.paths.Line(B, D),
                    chamferBottomLeft: new makerjs.paths.Line(C, E),
                    chamferBottomRight: new makerjs.paths.Line(D, F),
                    screwHoleLeft: new makerjs.paths.Circle(K, 1),
                    screwHoleRight: new makerjs.paths.Circle(L, 1)
                }
            }
        }
        else {





            let keySize = keyWidth;

            if (!key.skipOrientationFix && keyHeight > keyWidth) {
                keySize = keyHeight
            }

            let stab_spacing_left = null
            let stab_spacing_right = null

            if (keySize.gte(8)) {
                stab_spacing_left = stab_spacing_right = new Decimal("66.675")
            }
            else if (keySize.gte(7)) {
                stab_spacing_left = stab_spacing_right = new Decimal("57.15")
            }
            else if (keySize.gte(6.25)) {
                stab_spacing_left = stab_spacing_right = new Decimal("50")
            }
            else if (keySize.gte(6)) {
                stab_spacing_left = stab_spacing_right = new Decimal("47.625")
            }
            else {
                return null
            }

            const width = new Decimal("13.6")
            const upperBound = new Decimal("6.95")
            const lowerBound = new Decimal("-6.95")

            const plusHalfWidth = width.dividedBy(new Decimal("2"))
            const minsHalfWidth = width.dividedBy(new Decimal("-2"))

            A = [minsHalfWidth.plus(0.508).toNumber(), upperBound.toNumber()]
            B = [plusHalfWidth.minus(0.508).toNumber(), upperBound.toNumber()]
            C = [minsHalfWidth.plus(0.508).toNumber(), lowerBound.toNumber()]
            D = [plusHalfWidth.minus(0.508).toNumber(), lowerBound.toNumber()]

            E = [minsHalfWidth.toNumber(), upperBound.minus(0.508).toNumber()]
            F = [plusHalfWidth.toNumber(), upperBound.minus(0.508).toNumber()]
            G = [minsHalfWidth.toNumber(), lowerBound.plus(0.508).toNumber()]
            H = [plusHalfWidth.toNumber(), lowerBound.plus(0.508).toNumber()]

            var singleCutout = {
                paths: {
                    lineTop: new makerjs.paths.Line(A, B),
                    lineBottom: new makerjs.paths.Line(C, D),
                    lineLeft: new makerjs.paths.Line(E, G),
                    lineRight: new makerjs.paths.Line(F, H),
                    chamferTopLeft: new makerjs.paths.Line(E, A),
                    chamferTopRight: new makerjs.paths.Line(F, B),
                    chamferBottomLeft: new makerjs.paths.Line(G, C),
                    chamferBottomRight: new makerjs.paths.Line(H, D)
                }
            }

            var cutoutLeft = singleCutout;
            var cutoutRight = makerjs.model.clone(singleCutout);

            cutoutLeft = makerjs.model.move(cutoutLeft, [stab_spacing_left.times(-1).toNumber(), 0])
            cutoutRight = makerjs.model.move(cutoutRight, [stab_spacing_right.toNumber(), 0])

            cutouts = {
                models: {
                    "left": cutoutLeft,
                    "right": cutoutRight
                }
            }
        }
        if (!key.skipOrientationFix && keyHeight > keyWidth) {
            cutouts = makerjs.model.rotate(cutouts, -90)
        }

        return cutouts;
    }
}
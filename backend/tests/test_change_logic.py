from src.vending.purchase.service import calculate_change


def test_calculate_change_exact():
    stock = {10: 5, 5: 5, 1: 10}
    change_amount = 27

    result = calculate_change(change_amount, stock)

    assert result is not None
    # 27 = 10 + 10 + 5 + 1 + 1
    assert result[10] == 2
    assert result[5] == 1
    assert result[1] == 2
    assert sum(d * q for d, q in result.items()) == 27


def test_calculate_change_no_stock():
    stock = {}
    change_amount = 10

    result = calculate_change(change_amount, stock)

    assert result is None


def test_calculate_change_cannot_make_exact_change():
    stock = {10: 1}
    change_amount = 15

    result = calculate_change(change_amount, stock)

    assert result is None


def test_calculate_change_zero_amount():
    stock = {10: 5, 5: 5}
    change_amount = 0

    result = calculate_change(change_amount, stock)

    assert result == {}
